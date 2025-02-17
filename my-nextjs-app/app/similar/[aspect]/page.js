"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import SmallBookCard from "@/app/components/SmallBookCard";
import SimilarBookCard from "@/app/components/SimilarBookCard";
export default function SimilarBooksPage() {
  const { aspect } = useParams();
  const searchParams = useSearchParams();
  const excludeBookId = searchParams.get("excludeBookId");

  console.log(excludeBookId, "exclude book");
  // console.log(searchParams, "search params");

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bookName, setBookName] = useState("");

  useEffect(() => {
    async function fetchSimilarBooks() {
      try {
        const res = await fetch(
          `/api/getSimilarBooks?aspect=${aspect}&excludeBookId=${excludeBookId}`
        );
        console.log("resposne", res);
        if (!res.ok) throw new Error("No similar books found");
        const data = await res.json();
        setBooks(data.books || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (aspect && excludeBookId) fetchSimilarBooks();
  }, [aspect, excludeBookId]);

  useEffect(() => {
    async function fetchBookDetails() {
      try {
        const res = await fetch(`/api/book/${excludeBookId}`);
        if (!res.ok) throw new Error("Book not found");
        const data = await res.json();
        setBookName(data.title);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (excludeBookId) fetchBookDetails();
  }, [excludeBookId]);

  if (loading) return <p>Loading similar books...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (books.length === 0) return <p>No similar books found.</p>;

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-4">
        Books Similar to "{bookName}" Based on "{decodeURIComponent(aspect)}"
      </h1>
      <div className="flex flex-col gap-6">
        {books.map((book, index) => (
          <SimilarBookCard key={index} book={book} />
        ))}
      </div>
    </div>
  );
}
