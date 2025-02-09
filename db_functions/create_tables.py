import psycopg2
from dotenv import load_dotenv
import os
from sqlalchemy import create_engine

load_dotenv()

# Get database URL from environment variable
database_url = os.getenv('DATABASE_URL')
if not database_url:
    raise ValueError("DATABASE_URL environment variable is not set")

# Connect to PostgreSQL using environment variable
conn = psycopg2.connect(database_url)
cur = conn.cursor()

# Enable the pgvector extension (if not already enabled)
cur.execute("CREATE EXTENSION IF NOT EXISTS vector;")

# Create book_aspects table (for individual book aspects & embeddings)
cur.execute("""
    CREATE TABLE IF NOT EXISTS book_aspects (
        id SERIAL PRIMARY KEY,
        book_title TEXT,
        aspect TEXT,
        aspect_embedding vector(1536)  -- Store embeddings for similarity search
    );
""")

# Create review_aspects table (for aggregated review insights per book)
cur.execute("""
    CREATE TABLE IF NOT EXISTS review_aspects (
        id SERIAL PRIMARY KEY,
        book_title TEXT UNIQUE,
        review_aspects JSONB  -- Store extracted review aspects in JSON format
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
