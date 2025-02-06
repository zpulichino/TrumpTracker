import requests
import json
import time

# Your News API key
API_KEY = "d92531e15ee64ee6bf3b072a3a38fa89"

def scrape_trump_news():
    url = "https://newsapi.org/v2/everything"
    params = {
        "q": "donald trump",      # Search query
        "sortBy": "publishedAt",  # Sort by most recent
        "language": "en",         # Only English articles
        "apiKey": API_KEY,
    }
    
    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
    except Exception as e:
        print("Error fetching data from News API:", e)
        return

    data = response.json()
    articles = data.get("articles", [])
    news_items = []

    for article in articles:
        item = {
            "title": article.get("title", "No Title"),
            "description": article.get("description", "No description available."),
            "link": article.get("url", "No link available"),
            "timestamp": article.get("publishedAt", time.strftime("%Y-%m-%d %H:%M:%S"))
        }
        news_items.append(item)

    try:
        with open("trump_news.json", "w", encoding="utf-8") as f:
            json.dump(news_items, f, indent=2)
        print(f"Scraped {len(news_items)} items at {time.strftime('%Y-%m-%d %H:%M:%S')}")
    except Exception as e:
        print("Error writing JSON file:", e)

if __name__ == "__main__":
    scrape_trump_news()
