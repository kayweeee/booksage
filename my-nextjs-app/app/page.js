'use client';

import { useState } from 'react';
import axios from 'axios';
import Book from './components/Book';

export default function BookSearch() {
    const [query, setQuery] = useState('');
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
            console.error('Error fetching books:', error);
            setError('Failed to fetch books. Please try again.');
        }
        setLoading(false);
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-xl font-bold mb-4">Search for a Book</h1>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter book title..."
                className="border p-2 w-full mb-2"
            />
            <button
                onClick={handleSearch}
                className="bg-blue-500 text-white p-2 rounded w-full"
                disabled={loading}
            >
                {loading ? 'Searching...' : 'Search'}
            </button>

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
