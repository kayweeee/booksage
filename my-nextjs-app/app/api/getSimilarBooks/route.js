import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req) {
  const { searchParams } = new URL(
    req.url,
    `http://${req.headers.get("host")}`
  );
  const aspect = searchParams.get("aspect");
  const excludeBookId = searchParams.get("excludeBookId");

  if (!aspect || !excludeBookId) {
    return NextResponse.json(
      { error: "Aspect and excludeBookId are required" },
      { status: 400 }
    );
  }

  try {
    const client = await pool.connect();

    console.log("🔍 Retrieving aspect embedding...");
    const aspectEmbeddingResult = await client.query(
      `SELECT aspect_embedding FROM book_aspects WHERE aspect = $1 LIMIT 1;`,
      [aspect]
    );

    if (aspectEmbeddingResult.rows.length === 0) {
      client.release();
      console.log("❌ No embedding found.");
      return NextResponse.json(
        { error: "Aspect embedding not found" },
        { status: 404 }
      );
    }

    const aspectEmbedding = aspectEmbeddingResult.rows[0].aspect_embedding;

    console.log("🔍 Running similarity search...");
    const similarBooksResult = await client.query(
      `SELECT books.id, books.book_title, books.authors, books.summary, books.cover_image, books.average_rating, books.review_aspects, 
              book_aspects.aspect, book_aspects.aspect_embedding <-> $1 AS similarity
       FROM book_aspects
       JOIN books ON book_aspects.title = books.book_title
       WHERE books.id != $2
       ORDER BY similarity ASC
       LIMIT 3;`,
      [aspectEmbedding, excludeBookId]
    );

    client.release();

    console.log(`✅ Query executed in ${Date.now() - startTime}ms`);

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
          aspect,
          book.review_aspects
        );
        return {
          id: book.id,
          title: book.book_title,
          authors: book.authors || ["Unknown Author"],
          summary: book.summary || "No summary available",
          coverImage: book.cover_image || null,
          averageRating: book.average_rating || "Unknown",
          ratingsCount: book.ratings_count || "Unknown",
          aspectEvaluation,
        };
      })
    );

    return NextResponse.json({ books: booksWithInsights }, { status: 200 });
  } catch (error) {
    console.error("❌ Database error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure this is set in .env.local
});

// This function evaluates the aspect of a book based on the reviews of the book.
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
