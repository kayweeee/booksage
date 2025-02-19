import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { pathname } = req.nextUrl;
    const bookId = pathname.split("/").pop();

    if (!bookId) {
      return NextResponse.json(
        { error: "Book ID is required" },
        { status: 400 }
      );
    }

    const client = await pool.connect();

    // Fetch book details from `books` table
    const bookQuery = `
      SELECT 
        book_id, 
        title, 
        authors, 
        summary, 
        cover_image, 
        average_rating, 
        ratings_count, 
        review_aspects
      FROM books
      WHERE book_id = $1;
    `;

    const bookResult = await client.query(bookQuery, [bookId]);

    if (bookResult.rows.length === 0) {
      client.release();
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    const book = bookResult.rows[0];

    // Fetch book aspects from `book_aspects` table
    const aspectsQuery = `
      SELECT 
        aspect_id,
        book_aspect, 
        book_aspect_explanation, 
        book_aspect_sentiment, 
        book_aspect_mention_count
      FROM book_aspects
      WHERE book_id = $1;
    `;

    const aspectsResult = await client.query(aspectsQuery, [bookId]);
    client.release();

    // Format response
    return NextResponse.json(
      {
        bookId: book.book_id,
        title: book.title,
        authors: book.authors || ["Unknown Author"],
        summary: book.summary || "No summary available",
        coverImage: book.cover_image || null,
        averageRating: book.average_rating || "Unknown",
        ratingsCount: book.ratings_count || "Unknown",
        reviewAspects: book.review_aspects || {},
        bookAspects: aspectsResult.rows.map((aspect) => ({
          aspect_id: aspect.aspect_id,
          aspect: aspect.book_aspect,
          explanation: aspect.book_aspect_explanation,
          sentiment: aspect.book_aspect_sentiment,
          mentionCount: aspect.book_aspect_mention_count,
        })),
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
