from dotenv import load_dotenv
import os
from sqlalchemy import create_engine, text, types
import ast
import pandas as pd
import psycopg2

# Load the dataset
file_path = "../book_aspects_with_embeddings.csv"
df = pd.read_csv(file_path)

df.rename(columns={"Book": "book_title"}, inplace=True)

def parse_embedding(embedding_str):
    return list(map(float, embedding_str.strip("[]").split(',')))

df['aspect_embedding'] = df['aspect_embedding'].apply(parse_embedding)

# Load environment variables from .env file
load_dotenv()

# Get database URL from environment variable
database_url = os.getenv('DATABASE_URL')
if not database_url:
    raise ValueError("DATABASE_URL environment variable is not set")

# Connect to PostgreSQL using environment variable
engine = create_engine(database_url)
conn = psycopg2.connect(database_url)
cur = conn.cursor()

df_books = df[['book_title', 'review_aspects']].drop_duplicates()

# Insert review aspects into PostgreSQL
df_books.to_sql("review_aspects", engine, if_exists="replace", index=False, dtype={"review_aspects": types.JSON})

insert_query = """
    INSERT INTO book_aspects (book_title, aspect, aspect_embedding)
    VALUES (%s, %s, %s)
"""

for _, row in df.iterrows():
    cur.execute(insert_query, (row['book_title'], row['book_aspects'], row['aspect_embedding']))

conn.commit()
cur.close()
conn.close()