from dotenv import load_dotenv
import os
from sqlalchemy import create_engine, types
import ast
import pandas as pd
import psycopg2
from sqlalchemy.dialects.postgresql import JSONB
import json

load_dotenv()

# CONNECT TO DATABASE
database_url = os.getenv('DATABASE_URL')
if not database_url:
    raise ValueError("DATABASE_URL environment variable is not set")

engine = create_engine(database_url)
conn = psycopg2.connect(database_url)
cur = conn.cursor()

# # FOR BOOK TABLE
file_path = "../book_table.csv"
df_books = pd.read_csv(file_path)

def clean_authors(authors):
    if isinstance(authors, str):
        authors = ast.literal_eval(authors)
    return authors if isinstance(authors, list) else [authors]

df_books["authors"] = df_books["authors"].apply(clean_authors)

df_books.to_sql("books", engine, if_exists="append", index=False, dtype={
        "title": types.TEXT,
        "authors": types.ARRAY(types.TEXT),
        "summary": types.TEXT,
        "cover_image": types.TEXT,
        "average_rating": types.FLOAT,
        "ratings_count": types.INTEGER,
        "review_aspects": JSONB
    })

# FOR BOOK ASPECTS TABLE
file_path = "../book_aspects_table.csv"
df_aspects = pd.read_csv(file_path)

book_ids = {}
cur.execute("SELECT book_id, title FROM books;")
for book_id, title in cur.fetchall():
    book_ids[title] = book_id

insert_query = """
    INSERT INTO book_aspects (book_id, book_aspect, book_aspect_explanation, book_aspect_sentiment, book_aspect_mention_count, aspect_embedding)
    VALUES (%s, %s, %s, %s, %s, %s)
"""

def parse_embedding(embedding_str):
    return list(map(float, embedding_str.strip("[]").split(',')))

df_aspects['aspect_embedding'] = df_aspects['aspect_embedding'].apply(parse_embedding)


for _, row in df_aspects.iterrows():
    book_id = book_ids.get(row["title"])
    if book_id is None:
        print(f"⚠️ Warning: Book ID not found for title '{row['title']}'")
        continue

    book_aspect = row["book_aspect"]  # Use directly as it is in a column
    explanation = row["book_aspect_explanation"]
    sentiment = row["book_aspect_sentiment"]
    mention_count = row["book_aspect_mention_count"]
    embedding = row["aspect_embedding"]

    cur.execute(insert_query, (book_id, book_aspect, explanation, sentiment, mention_count, embedding))

print("Book aspects table populated successfully!")

conn.commit()
cur.close()
conn.close()