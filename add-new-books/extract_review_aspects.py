import pandas as pd
import json
import re
import os
import time
from dotenv import load_dotenv
from openai import OpenAI
from tqdm import tqdm
from config import CLEANED_REVIEWS_CSV, REVIEW_ASPECTS_CSV

load_dotenv()
openai_api_key = os.getenv("OPENAI_API_KEY")

client = OpenAI(api_key=openai_api_key)

COST_PER_1K_TOKENS = 0.002

total_tokens_used = 0
total_cost = 0.0

def estimate_cost(tokens_used):
    """Calculate cost based on OpenAI's pricing."""
    return (tokens_used / 1000) * COST_PER_1K_TOKENS

def extract_review_aspects(review):
    """Extracts nuanced review aspects using GPT-4o-mini."""
    global total_tokens_used, total_cost

    prompt = f"""
    Analyze the following book review and extract the unique and nuanced aspects of the book that the reader particularly commented on.
    
    Instead of predefined categories like 'Character Development' or 'World-building,' focus on specific insights the reviewer expresses. These should be framed in an organic way, capturing how the reviewer experienced and articulated their enjoyment of the book.

    Instructions:
    - Extract around 5 key aspects.
    - Do NOT use generic terms like "intricate plot twists" or "emotional depth."
    - Instead, identify book-specific observations (e.g., "Kaz Brekker’s morally ambiguous leadership" instead of "complex characters").
    - Capture distinctive stylistic elements, unusual themes, and memorable storytelling choices.
    - Use the reviewer's own language where possible.
    - Format the response as a valid JSON object where:
      - Each key is a brief descriptive insight (max 5 words).
      - Each value is an object containing:
        - `"explanation"`: A 1-2 sentence explanation based on the review’s language.

    Example Output (JSON format):
      ```json
      {{
        "Grisha magic and political tension": {{
          "explanation": "The reviewer describes the unique magic system intertwined with high-stakes political intrigue, making the world feel immersive and dangerous."
        }},
        "Unexpectedly humorous narration": {{
          "explanation": "The book’s witty and ironic tone added levity, contrasting well with its serious themes."
        }},
        "Ambiguous moral dilemmas": {{
          "explanation": "The novel presents ethical conflicts without clear resolutions, prompting deep reflection from the reader."
        }}
      }}

    Book Review:
    "{review}"
    """

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7
        )
        response_text = response.choices[0].message.content
        tokens_used = response.usage.total_tokens
        total_tokens_used += tokens_used
        total_cost += estimate_cost(tokens_used)
        return response_text
    except Exception as e:
        print(f"⚠️ OpenAI API Error: {e}")
        return None

def clean_and_convert_to_json(text):
    """Fixes common JSON formatting issues before parsing."""
    if not isinstance(text, str) or text.strip() == "":
        return None 

    # Remove markdown formatting if present
    text = text.strip().replace("```json", "").replace("```", "").replace("\n", " ")

    # Fix trailing commas before closing braces (`}`) and brackets (`]`)
    text = re.sub(r",\s*}", "}", text)  # Removes extra commas before }
    text = re.sub(r",\s*\]", "]", text)  # Removes extra commas before ]

    # Ensure JSON has a final closing brace if needed
    if text.count("{") > text.count("}"): 
        text += "}"

    try:
        return json.loads(text)
    except json.JSONDecodeError as e:
        print(f"❌ JSON Parsing Error: {e}")
        print(f"🔍 Problematic JSON Snippet: {text[:500]}...\n")
        return None

def process_reviews():
    """Runs the review aspect extraction pipeline."""
    global total_tokens_used, total_cost

    print("\n🔍 Loading cleaned reviews...")
    df = pd.read_csv(CLEANED_REVIEWS_CSV)

    if "cleaned_review" not in df.columns:
        raise ValueError("❌ Column 'cleaned_review' not found in the dataset!")

    tqdm.pandas()
    df["review_aspects"] = df["cleaned_review"].progress_apply(extract_review_aspects)

    # Convert extracted aspects to JSON format
    df["review_aspects"] = df["review_aspects"].apply(clean_and_convert_to_json)

    df.to_csv(REVIEW_ASPECTS_CSV, index=False)
    print(f"✅ Extracted review aspects saved to {REVIEW_ASPECTS_CSV}")

    print(f"\n💰 Total tokens used: {total_tokens_used}")
    print(f"💵 Estimated cost: ${total_cost:.4f}")

if __name__ == "__main__":
    process_reviews()
