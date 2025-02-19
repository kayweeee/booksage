import psycopg2
from dotenv import load_dotenv
import os
from sqlalchemy import create_engine

# Load environment variables
load_dotenv()


database_url = os.getenv('DATABASE_URL')
if not database_url:
    raise ValueError("DATABASE_URL environment variable is not set")

# Connect to PostgreSQL using environment variable
conn = psycopg2.connect(database_url)
cur = conn.cursor()

# Enable the pgvector extension (if not already enabled)
cur.execute("CREATE EXTENSION IF NOT EXISTS vector;")

# Create books table (stores metadata for each book)
cur.execute("""
    CREATE TABLE IF NOT EXISTS books (
        book_id SERIAL PRIMARY KEY,
        title TEXT UNIQUE NOT NULL,
        authors TEXT[],  -- Array of authors
        summary TEXT,  -- Book summary
        cover_image TEXT,  -- Cover image URL
        average_rating FLOAT,  -- Book average rating
        ratings_count INT,  -- Number of ratings
        review_aspects JSONB  -- Stores extracted review aspects in JSONB format
    );
""")

# Create book_aspects table (stores extracted book-level aspects)
cur.execute("""
    CREATE TABLE IF NOT EXISTS book_aspects (
        aspect_id SERIAL PRIMARY KEY,
        book_id INT REFERENCES books(book_id) ON DELETE CASCADE,  -- Link to books table
        book_aspect TEXT NOT NULL,  -- Consolidated book-level aspect
        book_aspect_explanation TEXT,  -- Explanation of the aspect
        book_aspect_sentiment TEXT CHECK (book_aspect_sentiment IN ('positive', 'negative', 'mixed')),  -- Aspect sentiment classification
        book_aspect_mention_count INT DEFAULT 0,  -- Number of reviews that mentioned this aspect
        aspect_embedding vector(1536)  -- Store embeddings for similarity search
    );
""")

# Create an index on aspect_embedding for faster similarity searches
cur.execute("""
    CREATE INDEX IF NOT EXISTS book_aspect_embedding_index 
    ON book_aspects USING hnsw (aspect_embedding vector_l2_ops);
""")

# Commit and close connection
conn.commit()
cur.close()
conn.close()

print("Tables created successfully!")
