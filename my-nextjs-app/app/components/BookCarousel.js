"use client";

import SmallBookCard from "./SmallBookCard";
import { useState, useEffect } from "react";

export default function BookCarousel() {
  const [books, setBooks] = useState([]);
  useEffect(() => {
    async function fetchBooks() {
      try {
        const res = await fetch("/api/getCarouselBooks");
        const data = await res.json();
        setBooks(data.books || []);
      } catch (error) {
        console.error("Error fetching random books:", error);
      }
    }

    fetchBooks();
  }, []);
  return (
    <div className="relative w-full overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-200px),transparent_100%)] pt-5 pb-8">
      <div className="flex whitespace-nowrap">
        {/* First loop */}
        <ul className="flex items-center animate-infinite-scroll">
          {books.map((book, index) => (
            <li key={index} className="mx-4">
              <SmallBookCard book={book} />
            </li>
          ))}
        </ul>

        <ul
          className="flex items-center animate-infinite-scroll"
          aria-hidden="true"
        >
          {books.map((book, index) => (
            <li key={`duplicate-${index}`} className="mx-4">
              <SmallBookCard book={book} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
