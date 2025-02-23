import pandas as pd
import html
import re
import contractions
from langdetect import detect
from langdetect.lang_detect_exception import LangDetectException
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from config import RAW_REVIEWS_CSV, CLEANED_REVIEWS_CSV

INPUT_CSV = RAW_REVIEWS_CSV
OUTPUT_CSV = CLEANED_REVIEWS_CSV

# Load CSV
df = pd.read_csv(INPUT_CSV)

### STEP 1: LANGUAGE DETECTION ###
def detect_language(text):
    """Detects language of text and returns 'en' if English, otherwise 'unknown'."""
    try:
        return detect(text)
    except LangDetectException:
        return "unknown"

print("🔍 Detecting language...")
df['language'] = df['review_text'].astype(str).apply(detect_language)

# Keep only English reviews
df = df[df['language'] == 'en'].drop(columns=['language'])
print(f"✅ Kept {len(df)} English reviews.")

### STEP 2: CLEAN TEXT ###
def clean_text(text):
    """Cleans review text: removes special chars, fixes contractions, removes extra spaces, and lowercases."""
    if not isinstance(text, str):
        return ""
    
    text = html.unescape(text)  # Convert HTML entities
    text = re.sub(r"[^a-zA-Z0-9\s!?.,]", "", text)  # Keep only valid characters
    text = contractions.fix(text)  # Expand contractions
    text = re.sub(r"\s+", " ", text).strip()  # Remove extra spaces
    return text.lower()

print("🧹 Cleaning review text...")
df['cleaned_review'] = df['review_text'].astype(str).apply(clean_text)

### STEP 3: FILTER SHORT REVIEWS ###
df['review_length'] = df['cleaned_review'].apply(lambda x: len(x.split()))
df = df[df['review_length'] >= 45].drop(columns=['review_length']).reset_index(drop=True)
df = df[['title', 'cleaned_review', 'review_text']]
print(f"✅ Filtered {len(df)} reviews with at least 45 words.")

# Save cleaned reviews
df.to_csv(OUTPUT_CSV, index=False)
print(f"📂 Cleaned reviews saved to {OUTPUT_CSV}")
