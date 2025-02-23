import os
import pandas as pd
import requests
from dotenv import load_dotenv
from tqdm import tqdm
from config import BOOK_TABLE_CSV, REVIEW_ASPECTS_CSV, RAW_REVIEWS_CSV

load_dotenv()
google_books_api_key = os.getenv("GOOGLE_BOOKS_API_KEY")
df_metadata = pd.read_csv(RAW_REVIEWS_CSV)

def fetch_book_details(title):
    """
    Fetches book metadata from Google Books API using the book title.
    - Prefers books with more ratings and recent editions.
    """
    url = f"https://www.googleapis.com/books/v1/volumes?q=intitle:{title}&key={google_books_api_key}"
    response = requests.get(url)
    data = response.json()
    book_entry = df_metadata[df_metadata["title"].str.lower() == title.lower()]
    book_entry = book_entry.iloc[0]


    if not data.get("items"):
        return {
            "title": title,
            "authors": ["Unknown"],
            "cover_image": None,
            "summary": book_entry['summary'],
            "average_rating":book_entry['average_rating'],
            "ratings_count": book_entry['ratings_count'],
        }

    best_match = None

    for book in data["items"]:
        volume_info = book["volumeInfo"]
        book_title = volume_info.get("title", "").lower()

        # Check if the title is a close match (case-insensitive)
        if title.lower() == book_title:
            if not best_match:
                best_match = volume_info
            else:
                # Prefer book with more ratings
                if volume_info.get("ratingsCount", 0) > best_match.get("ratingsCount", 0):
                    best_match = volume_info
                # If same rating count, prefer more recent editions
                elif volume_info.get("ratingsCount", 0) == best_match.get("ratingsCount", 0):
                    if volume_info.get("publishedDate", "0") > best_match.get("publishedDate", "0"):
                        best_match = volume_info

    if not best_match:
        return {
            "title": title,
            "authors": ["Unknown"],
            "cover_image": None,
            "summary": book_entry['summary'],
            "average_rating":book_entry['average_rating'],
            "ratings_count": book_entry['ratings_count'],
        }
    
    return {
        "title": best_match.get("title", title),
        "authors": best_match.get("authors", ["Unknown"]),
        "cover_image": best_match.get("imageLinks", {}).get("thumbnail", None),
        "summary": book_entry['summary'],
        "average_rating":book_entry['average_rating'],
        "ratings_count": book_entry['ratings_count'],
    }

def fetch_and_save_metadata():
    """Fetches book metadata, merges it with aspects, and saves to CSV."""
    print("\n📖 Fetching book metadata from Google Books API...")
    
    df_reviews = pd.read_csv(REVIEW_ASPECTS_CSV)

    if "title" not in df_reviews.columns or "review_aspects" not in df_reviews.columns:
        raise ValueError("❌ Required columns 'title' or 'review_aspects' missing!")

    df_books = df_reviews.groupby("title").agg({
        "review_aspects": list, 
        "review_text": list     
    }).reset_index()
    df_books.rename(columns={"review_text": "reviews"}, inplace=True)

    if "title" not in df_books.columns:
        raise ValueError("❌ Column 'title' missing from book aspects data!")

    book_metadata = []

    for title in tqdm(df_books["title"], desc="🔍 Fetching book metadata"):
        details = fetch_book_details(title)
        book_metadata.append(details)

    df_metadata = pd.DataFrame(book_metadata)

    df_metadata = pd.merge(df_metadata, df_books[['title', 'review_aspects', 'reviews']], on='title', how='left')

    df_metadata.to_csv(BOOK_TABLE_CSV, index=False)
    print(f"✅ Book metadata saved to {BOOK_TABLE_CSV}")

if __name__ == "__main__":
    fetch_and_save_metadata()
