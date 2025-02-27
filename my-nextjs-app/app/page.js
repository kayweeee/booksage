"use client";

import { useState } from "react";
import axios from "axios";
import BookCard from "./components/BookCard";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BookCarousel from "./components/BookCarousel";
import Image from "next/image";

export default function BookSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [noResults, setNoResults] = useState(false); // ✅ Track when no books are found

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setNoResults(false);

    try {
      const response = await axios.get(`/api/searchBooks?title=${query}`);

      if (response.data.books.length === 0) {
        setNoResults(true);
      } else {
        setResults(response.data.books);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
      setError("Failed to fetch books. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="p-6 flex flex-col items-center">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-center items-center flex-col">
          <Image
            src="/BookSageLogo.png"
            alt="Book Cover"
            width={320}
            height={100}
            className="w-80 object-cover rounded-lg"
          />
          <div className="relative">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
              size="md"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search by book title or author..."
              className="w-96 pl-12 pr-4 py-3 rounded-full text-lg border border-gray-300 bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-brown-300 transition-all"
            />
          </div>
        </div>
      </div>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {loading ? (
        <p className="mt-4 text-gray-700">Loading...</p>
      ) : noResults ? (
        <p className="mt-4 text-red-500 font-semibold">
          No books found. Please try another search.
        </p>
      ) : results.length > 0 ? (
        <div className="mt-4 max-w-3xl">
          <h2 className="text-lg font-semibold my-2">Search Results</h2>
          <ul className="list-none pl-0 flex flex-col gap-y-4">
            {results.map((book, index) => (
              <BookCard key={index} book={book} />
            ))}
          </ul>
        </div>
      ) : (
        <BookCarousel />
      )}
    </div>
  );
}
