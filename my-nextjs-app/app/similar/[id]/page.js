"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import SimilarBookCard from "@/app/components/SimilarBookCard";
import Loader from "@/app/components/Loader";
export default function SimilarBooksPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const excludeBookId = searchParams.get("excludeBookId");

  const [books, setBooks] = useState([]);
  const [aspect, setAspect] = useState("");
  const [targetBook, setTargetBook] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSimilarBooks() {
      try {
        const res = await fetch(
          `/api/getSimilarBooks?aspectId=${id}&excludeBookId=${excludeBookId}`
        );
        if (!res.ok) throw new Error("No similar books found");
        const data = await res.json();
        setBooks(data.books || []);
        setAspect(data.targetAspect);
        setTargetBook(data.targetBook);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (id && excludeBookId) fetchSimilarBooks();
  }, [id, excludeBookId]);

  if (loading)
    return <Loader message="Finding books with similar aspects..." />;

  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (books.length === 0) return <p>No similar books found.</p>;

  console.log(books, "books");

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-4">
        Books Similar to "{targetBook}" Based on "{aspect}"
      </h1>
      <div className="flex flex-col gap-6">
        {books.map((book, index) => (
          <SimilarBookCard key={index} book={book} />
        ))}
      </div>
    </div>
  );
}
