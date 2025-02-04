import aiohttp
import asyncio
from bs4 import BeautifulSoup
import json

BASE_URL = "https://www.goodreads.com/list/show/1.Best_Books_Ever?page="

async def fetch_page(session, url):
    """Fetches the content of a Goodreads list page."""
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36"
    }
    async with session.get(url, headers=headers) as response:
        if response.status != 200:
            print(f"Failed to fetch {url}: {response.status}")
            return None
        return await response.text()

async def scrape_goodreads_list():
    """Scrapes all book links from the Goodreads list."""
    book_links = []
    page_number = 1

    async with aiohttp.ClientSession() as session:
        while True:
            url = f"{BASE_URL}{page_number}"
            print(f"Scraping page {page_number}...")

            html = await fetch_page(session, url)
            if not html:
                break

            soup = BeautifulSoup(html, "html.parser")

            books = soup.select("a.bookTitle")
            for book in books:
                book_url = "https://www.goodreads.com" + book["href"]
                book_links.append(book_url)

            next_page = soup.select_one("a.next_page")
            if not next_page:
                print("No more pages found.")
                break

            # just for testing
            if page_number >10:
                break

            page_number += 1

    save_to_json(book_links)

    return book_links


def save_to_json(book_links, filename="books.json"):
    """Save book links to a JSON file."""
    with open(filename, "w") as f:
        json.dump(book_links, f, indent=4)
    print(f"Saved {len(book_links)} book links to {filename}")

async def main():
    book_urls = await scrape_goodreads_list()
    print(f"Total Books Scraped: {len(book_urls)}")
    print(book_urls[:10])

asyncio.run(main())
