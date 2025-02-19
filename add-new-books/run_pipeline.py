import os
import subprocess
import shutil
from datetime import datetime
from config import RAW_REVIEWS_CSV, CLEANED_REVIEWS_CSV, REVIEW_ASPECTS_CSV, BOOK_ASPECTS_TABLE_CSV, BOOK_TABLE_CSV

def run_scraper():
    print("\n🚀 Running Scraper...\n")
    subprocess.run(["python", "run_scraper.py"])
    if not os.path.exists(RAW_REVIEWS_CSV):
        raise FileNotFoundError("❌ Scraping failed! No 'book_reviews.csv' found.")

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

def extract_book_aspects():
    print("\n🧠 Extracting Book Aspects...\n")
    subprocess.run(["python", "extract_book_aspects.py"])
    if not os.path.exists(BOOK_ASPECTS_TABLE_CSV):
        raise FileNotFoundError("❌ Book aspect extraction failed! No 'book_aspects_table.csv' found.")

def fetch_book_metadata():
    print("\n🔍 Fetching Book Metadata...\n")
    subprocess.run(["python", "fetch_book_metadata.py"])
    if not os.path.exists(BOOK_TABLE_CSV):
        raise FileNotFoundError("❌ Book metadata fetching failed! No 'book_table.csv' found.")

def populate_db():
    print("\n🔍 Populating Database...\n")
    subprocess.run(["python", "populate_db.py"])


def move_processed_files():
    """Moves processed files to a timestamped 'processed' directory."""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    processed_folder = f"processed/{timestamp}"
    
    # Ensure the processed directory exists
    os.makedirs(processed_folder, exist_ok=True)

    data_dir = "data"
    if os.path.exists(data_dir):
        for file_name in os.listdir(data_dir):
            file_path = os.path.join(data_dir, file_name)
            if os.path.isfile(file_path):
                shutil.move(file_path, os.path.join(processed_folder, file_name))
    
    print(f"\n📁 All processed files moved to '{processed_folder}'!")

### MAIN FUNCTION ###
if __name__ == "__main__":
    try:
        # run_scraper()      
        process_reviews()    
        extract_review_aspects()
        extract_book_aspects() 
        fetch_book_metadata()
        populate_db()
        move_processed_files()

        print("\n🎉 Pipeline completed successfully!")
    except Exception as e:
        print(f"\n❌ Error in pipeline: {e}")
