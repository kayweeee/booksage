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
      `SELECT 
            books.book_id, books.title, books.authors, books.summary, 
            books.cover_image, books.average_rating, books.ratings_count,
            books.review_aspects, 
            book_aspects.book_aspect, 
            MIN(book_aspects.aspect_embedding <-> $1) AS similarity  -- ✅ Fix: Select MIN similarity per book
       FROM book_aspects
       JOIN books ON book_aspects.book_id = books.book_id
       WHERE books.book_id != $2
       GROUP BY books.book_id, books.title, books.authors, books.summary, 
                books.cover_image, books.average_rating, books.ratings_count, 
                books.review_aspects, book_aspects.book_aspect
       ORDER BY similarity ASC
       LIMIT 3;`,
      [aspectEmbedding, excludeBookId]
    );

    console.log(similarBooksResult.rows, "similarBooksResult");

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
  The following book has been identified as similar based on the aspect: "${aspect}".

  Task:
  - Analyze the book’s reviews and explain why this book is recommended for readers who enjoyed the given aspect.  
  - Provide 3 to 5 key reasons why this book aligns with the selected aspect.  
  - Use the reviews to support your points. 


  Guidelines:  
  - Keep responses concise and well-structured.  
  - Emphasize unique elements of the book that make it a strong recommendation based on the aspect.
  - Follow the exact output format below for consistency.
  

  Reviews Summary:  
  ${JSON.stringify(reviewAspects, null, 2)}

  ---

  **Required Output Format**  
  (Your response should follow this structure exactly.)

  This book has been identified as a strong recommendation for readers who appreciated the aspect **"${aspect}"**. Below is an in-depth analysis of why this book aligns with that aspect, supported by insights from reader reviews.  


  1. **[Key Reason 1]**
    - [Explanation: How the book captures this aspect effectively.]  


  2. **[Key Reason 2]**
    - [Explanation: Further details on how the book reflects this aspect.]  


  3. **[Key Reason 3]**
    - [Explanation: Another strong reason why this book resonates with readers who enjoy this aspect.]  


  4. **[Key Reason 4] (Optional)**
    - [Explanation: Additional depth into why this aspect is significant in the book.]  


  5. **[Key Reason 5] (Optional)**
    - [Explanation: Final supporting reason.]  

    
  ### Conclusion
  Overall, this book is a strong recommendation for readers drawn to **"${aspect}"** due to its [summary of key strengths related to the aspect]. The combination of [highlighted features] makes it a compelling choice for those who found this aspect engaging in previous books.
`;
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  return response.choices[0].message.content;
}
