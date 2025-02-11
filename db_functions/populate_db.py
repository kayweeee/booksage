from dotenv import load_dotenv
import os
from sqlalchemy import create_engine, text, types
import ast
import pandas as pd
import psycopg2
from sqlalchemy.dialects.postgresql import JSONB
# Load the dataset
file_path = "../book_aspects_with_embeddings.csv"
df = pd.read_csv(file_path)

df.rename(columns={"Book": "title"}, inplace=True)

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

# # create aspects embedding table
# insert_query = """
#     INSERT INTO book_aspects (title, aspect, aspect_embedding)
#     VALUES (%s, %s, %s)
# """

# for _, row in df.iterrows():
#     cur.execute(insert_query, (row['title'], row['book_aspects'], row['aspect_embedding']))


# FOR BOOK TABLE
file_path = "../book_table.csv"
df_books = pd.read_csv(file_path)

def clean_authors(authors):
    if isinstance(authors, str):
        authors = ast.literal_eval(authors)
    return authors if isinstance(authors, list) else [authors]

df_books["authors"] = df_books["authors"].apply(clean_authors)

df_books.to_sql("books", engine, if_exists="replace", index=False, dtype={
        "title": types.TEXT,
        "review_aspects": JSONB,
        "book_aspects": JSONB,
        "authors": types.ARRAY(types.TEXT),
        "summary": types.TEXT,
        "cover_image": types.TEXT,
        "average_rating": types.FLOAT,
        "ratings_count": types.INTEGER
    })

conn.commit()
cur.close()
conn.close()