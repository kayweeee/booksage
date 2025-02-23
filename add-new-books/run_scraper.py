import asyncio
import pandas as pd
import os
from config import RAW_REVIEWS_CSV, book_links

import aiohttp
from bs4 import BeautifulSoup
import re

async def scrape_goodreads_reviews(book_url):
    """Scrapes Goodreads reviews for a given book URL."""
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36"
    }

    async with aiohttp.ClientSession(headers=headers) as session:
        try:
            async with session.get(book_url, headers=headers) as response:
                if response.status != 200:
                    print(f"Failed to fetch {book_url}: {response.status}")
                    return None

                html = await response.text()
                soup = BeautifulSoup(html, "html.parser")

                title = soup.find("h1", class_="Text__title1").text.strip() if soup.find("h1", class_="Text__title1") else None
                summary = soup.find("span", class_="Formatted").text.strip() if soup.find("span", class_="Formatted") else "No summary available"
                rating = soup.find("div", class_="RatingStatistics__rating").text.strip() if soup.find("div", class_="RatingStatistics__rating") else None
                rating = float(rating) if rating else None

                ratings_count_tag = soup.find("span", {"data-testid": "ratingsCount"})
                ratings_text = ratings_count_tag.get_text(strip=True)
                ratings_text = re.sub(r"[^\d]", "", ratings_text)
                ratings_count = int(ratings_text) if ratings_text.isdigit() else 0

                review_cards = soup.find_all("article", class_="ReviewCard")
                if not review_cards:
                    print(f"No reviews found for {title}.")
                    return None

                reviews = []
                for card in review_cards[:30]:  # Limit to 30 reviews per book
                    try:
                        review_text = card.find("span", class_="Formatted").text.strip() if card.find("span", class_="Formatted") else None

                        reviews.append({
                            "title": title,                   
                            "review_text": review_text,
                            "summary": summary,
                            "average_rating": rating,
                            "ratings_count": ratings_count
                        })
                    except AttributeError:
                        continue

                return reviews

        except Exception as e:
            print(f"Error fetching {book_url}: {e}")
            return None

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

if __name__ == "__main__":
    asyncio.run(main())
