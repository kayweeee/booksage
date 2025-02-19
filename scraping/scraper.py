import aiohttp
from bs4 import BeautifulSoup
import re

async def scrape_goodreads_reviews(book_url):
    """Scrapes Goodreads reviews for a given book URL."""
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36"
    }

    async with aiohttp.ClientSession(headers=headers) as session:
        try:
            async with session.get(book_url, headers=headers) as response:
                if response.status != 200:
                    print(f"Failed to fetch {book_url}: {response.status}")
                    return None

                html = await response.text()
                soup = BeautifulSoup(html, "html.parser")

                title = soup.find("h1", class_="Text__title1").text.strip() if soup.find("h1", class_="Text__title1") else None
       
                review_cards = soup.find_all("article", class_="ReviewCard")
                if not review_cards:
                    print(f"No reviews found for {title}.")
                    return None

                reviews = []
                for card in review_cards[:30]:  # Limit to 30 reviews per book
                    try:
                        review_text = card.find("span", class_="Formatted").text.strip() if card.find("span", class_="Formatted") else None

                        reviews.append({
                            "title": title,                   
                            "review_text": review_text,
                        })
                    except AttributeError:
                        continue

                return reviews

        except Exception as e:
            print(f"Error fetching {book_url}: {e}")
            return None