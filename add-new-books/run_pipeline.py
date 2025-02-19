import os
import subprocess
from config import RAW_REVIEWS_CSV, CLEANED_REVIEWS_CSV, REVIEW_ASPECTS_CSV

### STEP 1: RUN SCRAPER ###
def run_scraper():
    print("\n🚀 Running Scraper...\n")
    subprocess.run(["python", "scraping/run_scraper.py"])
    if not os.path.exists(RAW_REVIEWS_CSV):
        raise FileNotFoundError("❌ Scraping failed! No 'book_reviews.csv' found.")

### STEP 2: PROCESS REVIEWS ###
def process_reviews():
    print("\n🧹 Processing & Cleaning Reviews...\n")
    subprocess.run(["python", "process_reviews.py"])
    if not os.path.exists(CLEANED_REVIEWS_CSV):
        raise FileNotFoundError("❌ Review processing failed! No 'book_reviews_cleaned.csv' found.")

def extract_review_aspects():
    print("\n🧠 Extracting Review Aspects...\n")
    subprocess.run(["python", "extract_review_aspects.py"])
    if not os.path.exists(REVIEW_ASPECTS_CSV):
        raise FileNotFoundError("❌ Review aspect extraction failed! No 'extracted_review_aspects.csv' found.")


### MAIN FUNCTION ###
if __name__ == "__main__":
    try:
        # run_scraper()        # Step 1
        # process_reviews()    # Step 2
        extract_review_aspects() # Step 3
        print("\n🎉 Pipeline completed successfully!")
    except Exception as e:
        print(f"\n❌ Error in pipeline: {e}")
