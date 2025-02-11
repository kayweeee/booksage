"use client";

import { useState } from "react";
import axios from "axios";
import Book from "./components/Book";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import SmallBookCard from "./components/SmallBookCard";

export default function BookSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/searchBooks?title=${query}`);
      setResults(response.data.books);
    } catch (error) {
      console.error("Error fetching books:", error);
      setError("Failed to fetch books. Please try again.");
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="p-6 ">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-center items-center flex-col">
          <img
            src="/BookSageLogo.png"
            alt="Book Cover"
            className="w-80 object-cover rounded-lg"
          />
          <div className="relative">
            <i className=" absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"></i>
            {/* <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
              size="lg"
            /> */}
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search for a book..."
              className="w-96 pl-12 pr-4 py-3 rounded-full text-lg border border-gray-300 bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-brown-300 transition-all"
            />
          </div>
        </div>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {results.length > 0 && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Search Results</h2>
          <ul className="list-none pl-0">
            {results.map((book, index) => (
              <Book key={index} book={book} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
