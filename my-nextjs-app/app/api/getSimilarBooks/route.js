import { NextResponse } from "next/server";
import OpenAI from "openai";
import pool from "@/lib/db";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Function to find similar books based on a selected aspect
async function findSimilarBooks(aspect) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT book_title 
             FROM book_aspects 
             ORDER BY aspect_embedding <-> (SELECT aspect_embedding FROM book_aspects WHERE aspect = $1 LIMIT 1) 
             LIMIT 3;`,
      [aspect]
    );
    return result.rows.map((row) => row.book_title);
  } catch (error) {
    console.error("Database error:", error);
    return [];
  } finally {
    client.release();
  }
}

// Function to fetch review aspects of books
async function getReviewAspects(books) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT book_title, review_aspects 
             FROM review_aspects 
             WHERE book_title = ANY($1);`,
      [books]
    );
    return result.rows;
  } catch (error) {
    console.error("Database error:", error);
    return [];
  } finally {
    client.release();
  }
}

// Function to generate aspect-specific insights using OpenAI
async function generateAspectInsights(aspect, bookReviews) {
  const insights = {};
  for (const { book_title, review_aspects } of bookReviews) {
    const prompt = `Based on reviews of "${book_title}", provide insights on the aspect "${aspect}" if mentioned.\nReviews: ${review_aspects}`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      });
      insights[book_title] = response.choices[0].message.content;
    } catch (error) {
      console.error("Error with OpenAI API:", error);
      insights[book_title] = "Could not generate insights.";
    }
  }
  return insights;
}

// API Route: /api/getSimilarBooks
export async function GET(req) {
  const { searchParams } = new URL(
    req.url,
    `http://${req.headers.get("host")}`
  );
  const aspect = searchParams.get("aspect");

  if (!aspect) {
    return NextResponse.json(
      { error: "Aspect query parameter is required" },
      { status: 400 }
    );
  }

  try {
    // Step 1: Find similar books based on the selected aspect
    const similarBooks = await findSimilarBooks(aspect);

    if (similarBooks.length === 0) {
      return NextResponse.json(
        { error: "No similar books found." },
        { status: 404 }
      );
    }

    // Step 2: Get review aspects of similar books
    const bookReviews = await getReviewAspects(similarBooks);

    // Step 3: Generate aspect-specific insights using OpenAI
    const insights = await generateAspectInsights(aspect, bookReviews);

    return NextResponse.json({ similarBooks, insights }, { status: 200 });
  } catch (error) {
    console.error("Error in similarity search:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
