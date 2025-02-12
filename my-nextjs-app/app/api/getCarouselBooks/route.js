import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await pool.connect();
    const result = await client.query(
      `SELECT id, book_title, authors, summary, cover_image, average_rating, ratings_count, book_aspects 
       FROM books 
       ORDER BY RANDOM() 
       LIMIT 8;`
    );
    client.release();

    // Format response
    const books = result.rows.map((row) => ({
      id: row.id,
      title: row.book_title,
      authors: row.authors || ["Unknown Author"],
      summary: row.summary || "No summary available",
      coverImage: row.cover_image || null,
      averageRating: row.average_rating || "Unknown",
      ratingsCount: row.ratings_count || "Unknown",
      bookAspects: row.book_aspects || {},
    }));

    return NextResponse.json({ books }, { status: 200 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
