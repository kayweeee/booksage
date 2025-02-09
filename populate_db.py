from dotenv import load_dotenv
import os
from sqlalchemy import create_engine, text

# Load environment variables from .env file
load_dotenv()

# Get database URL from environment variable
database_url = os.getenv('DATABASE_URL')
if not database_url:
    raise ValueError("DATABASE_URL environment variable is not set")

# Connect to PostgreSQL using environment variable
engine = create_engine(database_url)

# Create table
with engine.connect() as conn:
    conn.execute(text("""
        CREATE TABLE IF NOT EXISTS books (
            id SERIAL PRIMARY KEY,
            title TEXT UNIQUE,
            book_level_aspects JSONB,
            aspect_names TEXT[]
        );
    """))
    conn.commit()
