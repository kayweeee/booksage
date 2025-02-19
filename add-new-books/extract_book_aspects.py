import pandas as pd
import json
import os
import re
from dotenv import load_dotenv
from openai import OpenAI
from tqdm import tqdm
from config import REVIEW_ASPECTS_CSV, BOOK_ASPECTS_RAW_CSV, BOOK_ASPECTS_TABLE_CSV

load_dotenv()
openai_api_key = os.getenv("OPENAI_API_KEY")

client = OpenAI(api_key=openai_api_key)

COST_PER_1K_TOKENS = 0.002

def estimate_cost(tokens_used):
    """Calculate cost based on OpenAI's pricing."""
    return (tokens_used / 1000) * COST_PER_1K_TOKENS

def extract_book_level_aspects(review_aspects_list):
    """Extracts book-level insights from grouped review aspects using GPT-4o-mini."""
    if isinstance(review_aspects_list, list):  
        review_aspects_list = json.dumps(review_aspects_list, indent=2)  # Convert list to JSON
    
    prompt = f"""
    The following is a collection of review-level aspects extracted from multiple reviews of the same book. 
    Identify and summarize the most significant and recurring themes, insights, or unique elements that define this book as a whole.
    
    Instructions:
    - Consolidate similar aspects into broader book-level insights.
    - Focus on the most mentioned, impactful and unique insights.
    - Determine the general sentiment of each aspect by analyzing how it was described across reviews.
    - If an aspect has a mixed reception, reflect that in the summary.
    - Count how many reviews mention each aspect, and include that in the final output.

    - Return the result as a JSON object where:
      - Each key is a concise, descriptive book-level insight (no more than 5 words).
      - Each value is an object with:
        - `"explanation"`: A 1-2 sentence explanation, summarizing the aspect across all reviews.
        - `"sentiment"`: The general sentiment of the aspect ("positive", "negative", or "mixed"), based on how it was perceived in the reviews.
        - `"mention_count"`: The number of reviews that mentioned this aspect.

    
    Review-Level Aspects:
    {review_aspects_list}    

    ```json
    {{
      "Complex Political Themes": {{
        "explanation": "The book explores intricate political themes, drawing parallels to real-world authoritarian regimes and control mechanisms.",
        "sentiment": "positive",
        "mention_count": 12
      }},
      "Character Development": {{
        "explanation": "The protagonist's psychological depth and internal conflicts were widely appreciated, though a few readers found certain character arcs underdeveloped.",
        "sentiment": "positive",
        "mention_count": 15
      }}
    }}
    ```
    """

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7
        )
        response_text = response.choices[0].message.content
        return response_text
    except Exception as e:
        print(f"⚠️ OpenAI API Error: {e}")
        return None

def get_embedding(text):
    """Fetches vector embeddings for a given text."""
    text = text.lower()
    response = client.embeddings.create(
        model="text-embedding-ada-002",
        input=text
    )
    return response.data[0].embedding

def clean_and_convert_to_json(text):
    """Fixes JSON formatting issues before parsing."""
    if not isinstance(text, str) or text.strip() == "":
        return None

    # Remove markdown formatting
    text = text.strip().replace("```json", "").replace("```", "").replace("\n", " ")

    # Fix trailing commas before closing braces (`}`) and brackets (`]`)
    text = re.sub(r",\s*}", "}", text)  # Remove extra commas before }
    text = re.sub(r",\s*\]", "]", text)  # Remove extra commas before ]

    # Ensure JSON has a final closing brace if needed
    if text.count("{") > text.count("}"):  
        text += "}"

    try:
        return json.loads(text)
    except json.JSONDecodeError as e:
        print(f"❌ JSON Parsing Error: {e}")
        print(f"🔍 Problematic JSON Snippet: {text[:500]}...\n")
        return None

def extract_and_save_book_aspects():
    """Runs the book-level aspect extraction pipeline."""
    print("\n📚 Loading book review aspects...")
    df_reviews = pd.read_csv(REVIEW_ASPECTS_CSV)

    if "title" not in df_reviews.columns or "review_aspects" not in df_reviews.columns:
        raise ValueError("❌ Required columns 'title' or 'review_aspects' missing!")

    df_books = df_reviews.groupby("title")["review_aspects"].apply(list).reset_index()

    tqdm.pandas()
    df_books["book_aspects"] = df_books["review_aspects"].progress_apply(extract_book_level_aspects)

    # Save intermediate results before parsing
    df_books.to_csv(BOOK_ASPECTS_RAW_CSV, index=False)
    print(f"✅ Extracted raw book aspects saved to {BOOK_ASPECTS_RAW_CSV}")

def parse_and_save_book_aspects():
    """Parses LLM-generated book aspects and saves the final structured table."""
    print("\n🛠️ Parsing extracted book aspects...")
    df_books = pd.read_csv(BOOK_ASPECTS_RAW_CSV)

    parsed_data = []

    for _, row in df_books.iterrows():
        title = row["title"]
        review_aspects = row["review_aspects"]
        book_aspects = clean_and_convert_to_json(row["book_aspects"])

        if not book_aspects:
            continue 

        for aspect, details in book_aspects.items():
            parsed_data.append({
                "title": title,
                "review_aspects": review_aspects,
                "book_aspect": aspect,
                "book_aspect_explanation": details.get("explanation", ""),
                "book_aspect_sentiment": details.get("sentiment", "neutral"),
                "book_aspect_mention_count": details.get("mention_count", 0),
                "aspect_embedding": get_embedding(aspect)
            })

    # Convert to DataFrame and save
    df_parsed_aspects = pd.DataFrame(parsed_data)
    df_parsed_aspects.to_csv(BOOK_ASPECTS_TABLE_CSV, index=False)
    print(f"✅ Parsed book aspects saved to {BOOK_ASPECTS_TABLE_CSV}")

    # Cleanup temporary raw file
    os.remove(BOOK_ASPECTS_RAW_CSV)
    print(f"🗑️ Removed temporary file: {BOOK_ASPECTS_RAW_CSV}")

if __name__ == "__main__":
    extract_and_save_book_aspects()
    parse_and_save_book_aspects()
