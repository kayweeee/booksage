"use client";

import { useState } from "react";
import axios from "axios";
import Book from "./components/Book";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import SmallBookCard from "./components/SmallBookCard";
import BookCarousel from "./components/BookCarousel";
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

  const booksWithDetails = [
    {
      title: "1984",
      authors: ["George Orwell"],
      summary:
        "It is 1984. The world is in a state of perpetual war and Big Brother sees and controls all. Winston Smith, a member of the Outer Party and propaganda-writer at the Ministry of Truth, is keeping a journal he should not be keeping and falling in love with Julia, a woman he should not be seeing. Outwardly compliant, Winston dreams of rebellion against the oppressive Big Brother, risking everything to recover his lost sense of individuality and control of his own future. HarperPerennialClassics brings great works of literature to life in digital format, upholding the highest standards in ebook production and celebrating reading in all its forms. Look for more titles in the HarperPerennial Classics collection to build your digital library.",
      coverImage:
        "http://books.google.com/books/content?id=Ku0wEGoXp9gC&printsec=frontcover&img=1&zoom=1&source=gbs_api",
      averageRating: 5,
      ratingsCount: 64,
      bookAspects: {
        "Cultural richness and detail":
          "The narrative incorporates diverse cultural elements that add authenticity and depth to character interactions and backgrounds.",
        "Dynamic relationship dynamics":
          "Characters navigate evolving friendships and alliances, showcasing authentic connections forged in adversity and complexity.",
        "Exploration of moral ambiguity":
          "Characters face complex ethical dilemmas, prompting readers to reflect on their own beliefs about right and wrong.",
        "Layered narrative perspectives":
          "The story unfolds through multiple viewpoints, enriching the reader's understanding of characters and plot intricacies.",
        "Subtle humor amidst darkness":
          "Clever humor is woven into serious moments, providing levity that enhances character relationships and keeps the narrative engaging.",
        "Thought-provoking social commentary":
          "The book subtly critiques societal norms and issues, inviting readers to reflect on contemporary challenges without being didactic.",
        "Unconventional narrative structure":
          "The non-linear storytelling and intertwining timelines challenge traditional narrative forms, maintaining suspense and reader engagement.",
        "Vivid sensory descriptions":
          "The author's ability to evoke all five senses creates an immersive experience, allowing readers to feel present in the story's settings.",
      },
    },
    {
      title: "1984",
      authors: ["George Orwell"],
      summary:
        "It is 1984. The world is in a state of perpetual war and Big Brother sees and controls all. Winston Smith, a member of the Outer Party and propaganda-writer at the Ministry of Truth, is keeping a journal he should not be keeping and falling in love with Julia, a woman he should not be seeing. Outwardly compliant, Winston dreams of rebellion against the oppressive Big Brother, risking everything to recover his lost sense of individuality and control of his own future. HarperPerennialClassics brings great works of literature to life in digital format, upholding the highest standards in ebook production and celebrating reading in all its forms. Look for more titles in the HarperPerennial Classics collection to build your digital library.",
      coverImage:
        "http://books.google.com/books/content?id=Ku0wEGoXp9gC&printsec=frontcover&img=1&zoom=1&source=gbs_api",
      averageRating: 5,
      ratingsCount: 64,
      bookAspects: {
        "Cultural richness and detail":
          "The narrative incorporates diverse cultural elements that add authenticity and depth to character interactions and backgrounds.",
        "Dynamic relationship dynamics":
          "Characters navigate evolving friendships and alliances, showcasing authentic connections forged in adversity and complexity.",
        "Exploration of moral ambiguity":
          "Characters face complex ethical dilemmas, prompting readers to reflect on their own beliefs about right and wrong.",
        "Layered narrative perspectives":
          "The story unfolds through multiple viewpoints, enriching the reader's understanding of characters and plot intricacies.",
        "Subtle humor amidst darkness":
          "Clever humor is woven into serious moments, providing levity that enhances character relationships and keeps the narrative engaging.",
        "Thought-provoking social commentary":
          "The book subtly critiques societal norms and issues, inviting readers to reflect on contemporary challenges without being didactic.",
        "Unconventional narrative structure":
          "The non-linear storytelling and intertwining timelines challenge traditional narrative forms, maintaining suspense and reader engagement.",
        "Vivid sensory descriptions":
          "The author's ability to evoke all five senses creates an immersive experience, allowing readers to feel present in the story's settings.",
      },
    },
    {
      title: "1984",
      authors: ["George Orwell"],
      summary:
        "It is 1984. The world is in a state of perpetual war and Big Brother sees and controls all. Winston Smith, a member of the Outer Party and propaganda-writer at the Ministry of Truth, is keeping a journal he should not be keeping and falling in love with Julia, a woman he should not be seeing. Outwardly compliant, Winston dreams of rebellion against the oppressive Big Brother, risking everything to recover his lost sense of individuality and control of his own future. HarperPerennialClassics brings great works of literature to life in digital format, upholding the highest standards in ebook production and celebrating reading in all its forms. Look for more titles in the HarperPerennial Classics collection to build your digital library.",
      coverImage:
        "http://books.google.com/books/content?id=Ku0wEGoXp9gC&printsec=frontcover&img=1&zoom=1&source=gbs_api",
      averageRating: 5,
      ratingsCount: 64,
      bookAspects: {
        "Cultural richness and detail":
          "The narrative incorporates diverse cultural elements that add authenticity and depth to character interactions and backgrounds.",
        "Dynamic relationship dynamics":
          "Characters navigate evolving friendships and alliances, showcasing authentic connections forged in adversity and complexity.",
        "Exploration of moral ambiguity":
          "Characters face complex ethical dilemmas, prompting readers to reflect on their own beliefs about right and wrong.",
        "Layered narrative perspectives":
          "The story unfolds through multiple viewpoints, enriching the reader's understanding of characters and plot intricacies.",
        "Subtle humor amidst darkness":
          "Clever humor is woven into serious moments, providing levity that enhances character relationships and keeps the narrative engaging.",
        "Thought-provoking social commentary":
          "The book subtly critiques societal norms and issues, inviting readers to reflect on contemporary challenges without being didactic.",
        "Unconventional narrative structure":
          "The non-linear storytelling and intertwining timelines challenge traditional narrative forms, maintaining suspense and reader engagement.",
        "Vivid sensory descriptions":
          "The author's ability to evoke all five senses creates an immersive experience, allowing readers to feel present in the story's settings.",
      },
    },
    {
      title: "1984",
      authors: ["George Orwell"],
      summary:
        "It is 1984. The world is in a state of perpetual war and Big Brother sees and controls all. Winston Smith, a member of the Outer Party and propaganda-writer at the Ministry of Truth, is keeping a journal he should not be keeping and falling in love with Julia, a woman he should not be seeing. Outwardly compliant, Winston dreams of rebellion against the oppressive Big Brother, risking everything to recover his lost sense of individuality and control of his own future. HarperPerennialClassics brings great works of literature to life in digital format, upholding the highest standards in ebook production and celebrating reading in all its forms. Look for more titles in the HarperPerennial Classics collection to build your digital library.",
      coverImage:
        "http://books.google.com/books/content?id=Ku0wEGoXp9gC&printsec=frontcover&img=1&zoom=1&source=gbs_api",
      averageRating: 5,
      ratingsCount: 64,
      bookAspects: {
        "Cultural richness and detail":
          "The narrative incorporates diverse cultural elements that add authenticity and depth to character interactions and backgrounds.",
        "Dynamic relationship dynamics":
          "Characters navigate evolving friendships and alliances, showcasing authentic connections forged in adversity and complexity.",
        "Exploration of moral ambiguity":
          "Characters face complex ethical dilemmas, prompting readers to reflect on their own beliefs about right and wrong.",
        "Layered narrative perspectives":
          "The story unfolds through multiple viewpoints, enriching the reader's understanding of characters and plot intricacies.",
        "Subtle humor amidst darkness":
          "Clever humor is woven into serious moments, providing levity that enhances character relationships and keeps the narrative engaging.",
        "Thought-provoking social commentary":
          "The book subtly critiques societal norms and issues, inviting readers to reflect on contemporary challenges without being didactic.",
        "Unconventional narrative structure":
          "The non-linear storytelling and intertwining timelines challenge traditional narrative forms, maintaining suspense and reader engagement.",
        "Vivid sensory descriptions":
          "The author's ability to evoke all five senses creates an immersive experience, allowing readers to feel present in the story's settings.",
      },
    },
    {
      title: "1984",
      authors: ["George Orwell"],
      summary:
        "It is 1984. The world is in a state of perpetual war and Big Brother sees and controls all. Winston Smith, a member of the Outer Party and propaganda-writer at the Ministry of Truth, is keeping a journal he should not be keeping and falling in love with Julia, a woman he should not be seeing. Outwardly compliant, Winston dreams of rebellion against the oppressive Big Brother, risking everything to recover his lost sense of individuality and control of his own future. HarperPerennialClassics brings great works of literature to life in digital format, upholding the highest standards in ebook production and celebrating reading in all its forms. Look for more titles in the HarperPerennial Classics collection to build your digital library.",
      coverImage:
        "http://books.google.com/books/content?id=Ku0wEGoXp9gC&printsec=frontcover&img=1&zoom=1&source=gbs_api",
      averageRating: 5,
      ratingsCount: 64,
      bookAspects: {
        "Cultural richness and detail":
          "The narrative incorporates diverse cultural elements that add authenticity and depth to character interactions and backgrounds.",
        "Dynamic relationship dynamics":
          "Characters navigate evolving friendships and alliances, showcasing authentic connections forged in adversity and complexity.",
        "Exploration of moral ambiguity":
          "Characters face complex ethical dilemmas, prompting readers to reflect on their own beliefs about right and wrong.",
        "Layered narrative perspectives":
          "The story unfolds through multiple viewpoints, enriching the reader's understanding of characters and plot intricacies.",
        "Subtle humor amidst darkness":
          "Clever humor is woven into serious moments, providing levity that enhances character relationships and keeps the narrative engaging.",
        "Thought-provoking social commentary":
          "The book subtly critiques societal norms and issues, inviting readers to reflect on contemporary challenges without being didactic.",
        "Unconventional narrative structure":
          "The non-linear storytelling and intertwining timelines challenge traditional narrative forms, maintaining suspense and reader engagement.",
        "Vivid sensory descriptions":
          "The author's ability to evoke all five senses creates an immersive experience, allowing readers to feel present in the story's settings.",
      },
    },
    {
      title: "1984",
      authors: ["George Orwell"],
      summary:
        "It is 1984. The world is in a state of perpetual war and Big Brother sees and controls all. Winston Smith, a member of the Outer Party and propaganda-writer at the Ministry of Truth, is keeping a journal he should not be keeping and falling in love with Julia, a woman he should not be seeing. Outwardly compliant, Winston dreams of rebellion against the oppressive Big Brother, risking everything to recover his lost sense of individuality and control of his own future. HarperPerennialClassics brings great works of literature to life in digital format, upholding the highest standards in ebook production and celebrating reading in all its forms. Look for more titles in the HarperPerennial Classics collection to build your digital library.",
      coverImage:
        "http://books.google.com/books/content?id=Ku0wEGoXp9gC&printsec=frontcover&img=1&zoom=1&source=gbs_api",
      averageRating: 5,
      ratingsCount: 64,
      bookAspects: {
        "Cultural richness and detail":
          "The narrative incorporates diverse cultural elements that add authenticity and depth to character interactions and backgrounds.",
        "Dynamic relationship dynamics":
          "Characters navigate evolving friendships and alliances, showcasing authentic connections forged in adversity and complexity.",
        "Exploration of moral ambiguity":
          "Characters face complex ethical dilemmas, prompting readers to reflect on their own beliefs about right and wrong.",
        "Layered narrative perspectives":
          "The story unfolds through multiple viewpoints, enriching the reader's understanding of characters and plot intricacies.",
        "Subtle humor amidst darkness":
          "Clever humor is woven into serious moments, providing levity that enhances character relationships and keeps the narrative engaging.",
        "Thought-provoking social commentary":
          "The book subtly critiques societal norms and issues, inviting readers to reflect on contemporary challenges without being didactic.",
        "Unconventional narrative structure":
          "The non-linear storytelling and intertwining timelines challenge traditional narrative forms, maintaining suspense and reader engagement.",
        "Vivid sensory descriptions":
          "The author's ability to evoke all five senses creates an immersive experience, allowing readers to feel present in the story's settings.",
      },
    },
  ];

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

      <BookCarousel books={booksWithDetails} />

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
