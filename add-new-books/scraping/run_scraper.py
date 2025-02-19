from scraper import scrape_goodreads_reviews
import asyncio
import pandas as pd
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from config import RAW_REVIEWS_CSV, book_links

async def scrape_all_books(book_links):
    """Scrapes reviews for multiple books asynchronously."""
    all_reviews = []
    
    tasks = [scrape_goodreads_reviews(book_url) for book_url in book_links]
    results = await asyncio.gather(*tasks)

    for book_reviews in results:
        if book_reviews:
            all_reviews.extend(book_reviews)

    return all_reviews

def save_to_csv(data, filename=RAW_REVIEWS_CSV):
    """Saves scraped reviews to a CSV file (appends if exists)."""
    df = pd.DataFrame(data)

    if os.path.exists(filename):
        existing_df = pd.read_csv(filename)
        df = pd.concat([existing_df, df], ignore_index=True)

    df.to_csv(filename, index=False)
    print(f"✅ Saved {len(df)} reviews to {filename}")

async def main():
    print("🔍 Scraping reviews...")
    all_reviews = await scrape_all_books(book_links)

    if all_reviews:
        save_to_csv(all_reviews)
    else:
        print("⚠️ No reviews scraped.")

# Run the scraper when executed directly
if __name__ == "__main__":
    asyncio.run(main())
