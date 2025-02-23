from dotenv import load_dotenv
import os
import pandas as pd
import ast
import json
import psycopg2
from sqlalchemy import create_engine, types
from sqlalchemy.dialects.postgresql import JSONB
from config import BOOK_TABLE_CSV, BOOK_ASPECTS_TABLE_CSV 

load_dotenv()
database_url = os.getenv("DATABASE_URL")

if not database_url:
    raise ValueError("❌ DATABASE_URL environment variable is not set!")

engine = create_engine(database_url)
conn = psycopg2.connect(database_url)
cur = conn.cursor()

print("\n📚 Inserting book metadata into 'books' table...")
df_books = pd.read_csv(BOOK_TABLE_CSV)

def convert_to_list(array_str):
    """Ensures authors are stored as a list."""
    if isinstance(array_str, str):
        array_str = ast.literal_eval(array_str)
    return array_str if isinstance(array_str, list) else [array_str]

df_books["authors"] = df_books["authors"].apply(convert_to_list)
df_books["reviews"] = df_books["reviews"].apply(convert_to_list)
df_books["average_rating"] = df_books["average_rating"].astype(float).round(1)

insert_books_query = """
    INSERT INTO books (title, authors, summary, cover_image, average_rating, ratings_count, review_aspects, reviews)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    ON CONFLICT (title) DO NOTHING;
"""

for _, row in df_books.iterrows():
    cur.execute(insert_books_query, (
        row["title"], 
        row["authors"], 
        row["summary"], 
        row["cover_image"], 
        row["average_rating"], 
        row["ratings_count"], 
        json.dumps(row["review_aspects"]), 
        row["reviews"]
    ))

print("✅ 'books' table populated successfully!")

print("\n🔍 Retrieving book IDs for aspect linking...")
book_ids = {}
cur.execute("SELECT book_id, title FROM books;")
for book_id, title in cur.fetchall():
    book_ids[title] = book_id

print("\n📊 Inserting book-level aspects into 'book_aspects' table...")
df_aspects = pd.read_csv(BOOK_ASPECTS_TABLE_CSV)

insert_query = """
    INSERT INTO book_aspects 
    (book_id, book_aspect, book_aspect_explanation, book_aspect_sentiment, book_aspect_mention_count, aspect_embedding)
    VALUES (%s, %s, %s, %s, %s, %s)
"""

def parse_embedding(embedding_str):
    """Converts string embeddings to float lists."""
    return list(map(float, embedding_str.strip("[]").split(',')))

df_aspects["aspect_embedding"] = df_aspects["aspect_embedding"].apply(parse_embedding)

for _, row in df_aspects.iterrows():
    book_id = book_ids.get(row["title"])
    if book_id is None:
        print(f"⚠️ Warning: Book ID not found for title '{row['title']}'")
        continue

    cur.execute(insert_query, (
        book_id, 
        row["book_aspect"], 
        row["book_aspect_explanation"], 
        row["book_aspect_sentiment"], 
        row["book_aspect_mention_count"], 
        row["aspect_embedding"]
    ))

print("✅ 'book_aspects' table populated successfully!")

conn.commit()
cur.close()
conn.close()
print("\n🎉 Database population complete!")
