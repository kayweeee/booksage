import os

# IMPORTANT: POPULATE WITH BOOK LINKS TO SCRAPE
book_links = [
        "https://www.goodreads.com/book/show/2767052-the-hunger-games",
        "https://www.goodreads.com/book/show/4671.The_Great_Gatsby"
    ]

DATA_DIR = "data"
os.makedirs(DATA_DIR, exist_ok=True)

RAW_REVIEWS_CSV = os.path.join(DATA_DIR, "book_reviews.csv")
CLEANED_REVIEWS_CSV = os.path.join(DATA_DIR, "book_reviews_cleaned.csv")
REVIEW_ASPECTS_CSV = os.path.join(DATA_DIR, "extracted_review_aspects.csv")
BOOK_ASPECTS_RAW_CSV = os.path.join(DATA_DIR, "extracted_book_aspects_raw.csv")
BOOK_ASPECTS_TABLE_CSV = os.path.join(DATA_DIR, "book_aspects_table.csv")
BOOK_TABLE_CSV = os.path.join(DATA_DIR, "book_table.csv")