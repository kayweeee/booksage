import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { pathname } = req.nextUrl;
  const id = pathname.split("/").pop();

  if (!id) {
    return NextResponse.json({ error: "Book ID is required" }, { status: 400 });
  }

  try {
    const client = await pool.connect();
    const result = await client.query(
      `SELECT id, book_title, authors, summary, cover_image, average_rating, ratings_count, review_aspects, book_aspects 
       FROM books 
       WHERE id = $1;`,
      [id]
    );
    client.release();

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    const book = result.rows[0];

    return NextResponse.json(
      {
        id: book.id,
        title: book.book_title,
        authors: book.authors || ["Unknown Author"],
        summary: book.summary || "No summary available",
        coverImage: book.cover_image || null,
        averageRating: book.average_rating || "Unknown",
        ratingsCount: book.ratings_count || "Unknown",
        reviewAspects: book.review_aspects || {},
        bookAspects: book.book_aspects || {},
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
