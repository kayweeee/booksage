"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import StarRating from "@/app/components/StarRating";
import AspectDesc from "@/app/components/AspectDesc";

export default function BookPage() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBookDetails() {
      try {
        const res = await fetch(`/api/book/${id}`);
        if (!res.ok) throw new Error("Book not found");
        const data = await res.json();
        setBook(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchBookDetails();
  }, [id]);

  console.log(book);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!book) return <p>No book found.</p>;

  return (
    <div className="container mx-auto p-6 flex flex-col justify-center items-center gap-y-10 max-w-4xl">
      <div className="flex flex-row gap-4 justify-center mt-4">
        <div className="w-1/3">
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-64 rounded-lg shadow-md"
          />
        </div>
        <div className="w-2/3 gap-y-3 flex flex-col">
          <div>
            <h1>{book.title}</h1>
            <h3 className="text-gray-500">{book.authors.join(", ")}</h3>
          </div>
          <StarRating
            rating={book.averageRating}
            numberOfReviews={book.ratingsCount}
          />
          <p>{book.summary}</p>
        </div>
      </div>
      <div className="flex flex-col gap-y-2 w-full text-center">
        <h2 className="underline underline-offset-4">
          What did people like about this book?
        </h2>
        <div className="mt-3 flex flex-col gap-4 w-4/5 mx-auto">
          {book.bookAspects &&
            book.bookAspects.map((aspect, index) => (
              <AspectDesc key={index} aspect={aspect} id={book.bookId} />
            ))}
        </div>
      </div>
    </div>
  );
}
