import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await pool.connect();

    // Fetch 8 random books
    const booksQuery = `
      SELECT 
        book_id, 
        title, 
        authors, 
        summary, 
        cover_image, 
        average_rating, 
        ratings_count
      FROM books
      ORDER BY RANDOM()
      LIMIT 8;
    `;

    const booksResult = await client.query(booksQuery);
    const books = booksResult.rows;

    if (books.length === 0) {
      client.release();
      return NextResponse.json({ error: "No books found" }, { status: 404 });
    }

    // Fetch book aspects for the selected books
    const bookIds = books.map((book) => book.book_id);
    const aspectsQuery = `
      SELECT 
        book_id, 
        book_aspect, 
        book_aspect_explanation, 
        book_aspect_sentiment, 
        book_aspect_mention_count
      FROM book_aspects
      WHERE book_id = ANY($1);
    `;

    const aspectsResult = await client.query(aspectsQuery, [bookIds]);
    client.release();

    // Organize aspects by book_id
    const aspectsMap = {};
    aspectsResult.rows.forEach((aspect) => {
      if (!aspectsMap[aspect.book_id]) {
        aspectsMap[aspect.book_id] = [];
      }
      aspectsMap[aspect.book_id].push({
        aspect: aspect.book_aspect,
        explanation: aspect.book_aspect_explanation,
        sentiment: aspect.book_aspect_sentiment,
        mentionCount: aspect.book_aspect_mention_count,
      });
    });

    // Format response
    const response = books.map((book) => ({
      bookId: book.book_id,
      title: book.title,
      authors: book.authors || ["Unknown Author"],
      summary: book.summary || "No summary available",
      coverImage: book.cover_image || null,
      averageRating: book.average_rating || "Unknown",
      ratingsCount: book.ratings_count || "Unknown",
      bookAspects: aspectsMap[book.book_id] || [], // Attach aspects if available
    }));

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
