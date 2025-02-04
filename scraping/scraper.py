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

                title = soup.find("h1", class_="H1Title").text.strip() if soup.find("h1", class_="H1Title") else None
                author = soup.find("span", class_="ContributorLink__name").text.strip() if soup.find("span", class_="ContributorLink__name") else None
                avg_rating = soup.find("div", class_="RatingStatistics__rating").text.strip() if soup.find("div", class_="RatingStatistics__rating") else None

                review_cards = soup.find_all("article", class_="ReviewCard")
                if not review_cards:
                    print(f"No reviews found for {title}.")
                    return None

                reviews = []
                for card in review_cards[:30]:  # Limit to 30 reviews per book
                    try:
                        review_date_element = card.find("span", class_="Text Text__body3")
                        review_date = review_date_element.text.strip() if review_date_element else None

                        review_text = card.find("span", class_="Formatted").text.strip() if card.find("span", class_="Formatted") else None

                        likes_button = card.find("button", text=lambda x: x and "likes" in x.lower())
                        likes_text = likes_button.text.strip() if likes_button else "0"
                        likes = int(re.search(r'\d+', likes_text).group()) if re.search(r'\d+', likes_text) else 0

                        comments_button = card.find("button", text=lambda x: x and "comments" in x.lower())
                        comments_text = comments_button.text.strip() if comments_button else "0"
                        comments = int(re.search(r'\d+', comments_text).group()) if re.search(r'\d+', comments_text) else 0

                        reviews.append({
                            "book_url": book_url,
                            "title": title,
                            "author": author,
                            "avg_rating": avg_rating,
                            "review_date": review_date,
                            "review_text": review_text,
                            "likes": likes,
                            "comments": comments
                        })
                    except AttributeError:
                        continue

                return reviews

        except Exception as e:
            print(f"Error fetching {book_url}: {e}")
            return None