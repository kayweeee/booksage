import pool from "@/lib/db";
import { NextResponse } from 'next/server';


async function fetchBookDetails(title) {
    try {
        const response = await fetch(
            `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(title)}&key=${process.env.GOOGLE_BOOKS_API_KEY}`
        );
        const data = await response.json();
        
        if (data.items && data.items.length > 0) {
            const book = data.items[0].volumeInfo;

            console.log(book);
            return {
                title: book.title || title,
                authors: book.authors || ["Unknown Author"],
                summary: book.description || "No summary available",
                coverImage: book.imageLinks?.thumbnail || null,
                pageCount: book.pageCount || "Unknown",
                categories: book.categories || ["Uncategorized"]
            };
        }
        return { title, authors: ["Unknown"], summary: "No details found", coverImage: null, pageCount: "Unknown", categories: ["Uncategorized"] };
    } catch (error) {
        console.error("Error fetching book details:", error);
        return { title, authors: ["Unknown"], summary: "Error retrieving details", coverImage: null, pageCount: "Unknown", categories: ["Uncategorized"] };
    }
}

export async function GET(req) {
    const { searchParams } = new URL(req.url, `http://${req.headers.get('host')}`);
    const title = searchParams.get("title");
    
    if (!title) {
        return NextResponse.json({ error: "Title query parameter is required" }, { status: 400 });
    }
    
    try {
        const client = await pool.connect();
        const result = await client.query(
            "SELECT DISTINCT book_title FROM book_aspects WHERE book_title ILIKE $1 LIMIT 10;",
            [`%${title}%`]
        );
        client.release();

        const bookTitles = result.rows.map(row => row.book_title);

        // Fetch details for each book from Google Books API
        const booksWithDetails = await Promise.all(bookTitles.map(fetchBookDetails));

        return NextResponse.json({ books: booksWithDetails }, { status: 200 });
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
    }
}