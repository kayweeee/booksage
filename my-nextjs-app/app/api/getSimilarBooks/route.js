import { NextResponse } from "next/server";
import pool from "@/lib/db";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure this is set in .env.local
});

export async function GET(req) {
  const { searchParams } = new URL(
    req.url,
    `http://${req.headers.get("host")}`
  );
  const aspectId = searchParams.get("aspectId");
  const excludeBookId = searchParams.get("excludeBookId");

  if (!aspectId || !excludeBookId) {
    return NextResponse.json(
      { error: "Aspect ID and excludeBookId are required" },
      { status: 400 }
    );
  }

  try {
    const client = await pool.connect();

    console.log("🔍 Retrieving target aspect and embedding...");
    const aspectEmbeddingResult = await client.query(
      `SELECT aspect_embedding, book_aspect, book_id FROM book_aspects WHERE aspect_id = $1 LIMIT 1;`,
      [aspectId]
    );

    if (aspectEmbeddingResult.rows.length === 0) {
      client.release();
      console.log("❌ No aspect embedding found.");
      return NextResponse.json(
        { error: "Aspect embedding not found" },
        { status: 404 }
      );
    }

    const {
      aspect_embedding: aspectEmbedding,
      book_aspect: targetAspect,
      book_id: targetBookId,
    } = aspectEmbeddingResult.rows[0];

    console.log("🔍 Retrieving target book title...");
    const targetBookResult = await client.query(
      `SELECT title FROM books WHERE book_id = $1 LIMIT 1;`,
      [targetBookId]
    );

    if (targetBookResult.rows.length === 0) {
      client.release();
      console.log("❌ Target book not found.");
      return NextResponse.json(
        { error: "Target book not found" },
        { status: 404 }
      );
    }

    const targetBook = targetBookResult.rows[0].title;

    console.log("🔍 Running similarity search...");
    const similarBooksResult = await client.query(
      `SELECT DISTINCT ON (books.book_id) 
              books.book_id, books.title, books.authors, books.summary, books.cover_image, books.average_rating, books.ratings_count,
              books.review_aspects, -- ✅ Added review aspects
              book_aspects.book_aspect, book_aspects.aspect_embedding <-> $1 AS similarity
       FROM book_aspects
       JOIN books ON book_aspects.book_id = books.book_id
       WHERE books.book_id != $2
       ORDER BY books.book_id, similarity ASC
       LIMIT 3;`,
      [aspectEmbedding, excludeBookId]
    );

    client.release();

    if (similarBooksResult.rows.length === 0) {
      return NextResponse.json(
        { error: "No similar books found" },
        { status: 404 }
      );
    }

    console.log("🧠 Running LLM aspect evaluation...");
    const booksWithInsights = await Promise.all(
      similarBooksResult.rows.map(async (book) => {
        const aspectEvaluation = await evaluateAspect(
          targetAspect,
          book.review_aspects
        );
        return {
          id: book.book_id,
          title: book.title,
          authors: book.authors || ["Unknown Author"],
          summary: book.summary || "No summary available",
          coverImage: book.cover_image || null,
          averageRating: book.average_rating || "Unknown",
          ratingsCount: book.ratings_count || "Unknown",
          aspectEvaluation,
        };
      })
    );

    return NextResponse.json(
      { books: booksWithInsights, targetAspect, targetBook },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Database error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}

// ✅ Updated LLM function to analyze reviews
async function evaluateAspect(aspect, reviewAspects) {
  const prompt = `
  Analyze the reviews of this book and explain how they relate to the aspect: "${aspect}". 
  If they don't discuss it, say so. If they do discuss it, provide a brief evaluation of the aspect.

  Reviews Summary:
  ${JSON.stringify(reviewAspects, null, 2)}
  
  Your response should be a concise analysis.
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  return response.choices[0].message.content;
}
