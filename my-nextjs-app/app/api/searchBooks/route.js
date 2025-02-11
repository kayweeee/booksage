import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(
    req.url,
    `http://${req.headers.get("host")}`
  );
  const title = searchParams.get("title");

  if (!title) {
    return NextResponse.json(
      { error: "Title query parameter is required" },
      { status: 400 }
    );
  }

  try {
    const client = await pool.connect();

    // Fetch books with details from the `books` table
    const result = await client.query(
      `SELECT book_title, authors, summary, cover_image, average_rating, ratings_count, review_aspects, book_aspects
       FROM books WHERE book_title ILIKE $1 LIMIT 10;`,
      [`%${title}%`]
    );

    client.release();

    if (result.rows.length === 0) {
      return NextResponse.json({ message: "No books found" }, { status: 404 });
    }

    // Format response
    const booksWithDetails = result.rows.map((row) => ({
      title: row.book_title,
      authors: row.authors || ["Unknown Author"],
      summary: row.summary || "No summary available",
      coverImage: row.cover_image || null,
      averageRating: row.average_rating || "Unknown",
      ratingsCount: row.ratings_count || "Unknown",
      bookAspects: row.book_aspects || {},
    }));

    return NextResponse.json({ books: booksWithDetails }, { status: 200 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
