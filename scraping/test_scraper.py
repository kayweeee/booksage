from scraper import scrape_goodreads_reviews
import asyncio
import json
import pandas as pd
from bs4 import BeautifulSoup
import re
from datetime import datetime

# Load book URLs from books.json
def load_book_links(filename="books.json"):
    """Loads book URLs from a JSON file."""
    with open(filename, "r") as f:
        return json.load(f)

# Run scraper for all book links
async def scrape_all_books(book_links):
    """Scrapes reviews for multiple books asynchronously."""
    all_reviews = []
    
    tasks = [scrape_goodreads_reviews(book_url) for book_url in book_links]
    results = await asyncio.gather(*tasks)

    for book_reviews in results:
        if book_reviews:
            all_reviews.extend(book_reviews)  # Flatten list of lists

    return all_reviews

# Save data to CSV
def save_to_csv(data, filename=f"book_reviews_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"):
    """Saves scraped reviews to a CSV file."""
    df = pd.DataFrame(data)
    df.to_csv(filename, index=False)
    print(f"Saved {len(df)} reviews to {filename}")

# Main function to run everything
async def main():
    book_links = ["https://www.goodreads.com/book/show/2767052-the-hunger-games"]

    all_reviews = await scrape_all_books(book_links)

    if all_reviews:
        save_to_csv(all_reviews)

# Run the scraper
asyncio.run(main())