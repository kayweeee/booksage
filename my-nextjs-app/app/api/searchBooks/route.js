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

  let client;
  try {
    client = await pool.connect();

    // Query books with book aspects using LEFT JOIN
    const result = await client.query(
      `
      SELECT 
        b.book_id, 
        b.title, 
        b.authors, 
        b.summary, 
        b.cover_image, 
        b.average_rating, 
        b.ratings_count,
        COALESCE(json_agg(
          json_build_object(
            'aspect', ba.book_aspect, 
            'explanation', ba.book_aspect_explanation, 
            'sentiment', ba.book_aspect_sentiment, 
            'mention_count', ba.book_aspect_mention_count
          )
        ) FILTER (WHERE ba.book_aspect IS NOT NULL), '[]') AS book_aspects
      FROM books b
      LEFT JOIN book_aspects ba ON b.book_id = ba.book_id
      WHERE b.title ILIKE $1
      GROUP BY b.book_id
      LIMIT 10;
      `,
      [`%${title}%`]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ message: "No books found" }, { status: 404 });
    }

    // Format response
    const booksWithDetails = result.rows.map((row) => ({
      id: row.book_id,
      title: row.title,
      authors: row.authors || ["Unknown Author"],
      summary: row.summary || "No summary available",
      coverImage: row.cover_image || null,
      averageRating: row.average_rating || "Unknown",
      ratingsCount: row.ratings_count || "Unknown",
      bookAspects: row.book_aspects || [], // Ensure an empty array if no aspects exist
    }));

    return NextResponse.json({ books: booksWithDetails }, { status: 200 });
  } catch (error) {
    console.error("❌ Database error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  } finally {
    if (client) client.release(); // Ensure the connection is always released
  }
}
