import requests
import json
import time
import schedule

# Your News API key (replace with your actual key if needed)
API_KEY = "d92531e15ee64ee6bf3b072a3a38fa89"

def scrape_trump_news():
    # Define the endpoint and parameters
    url = "https://newsapi.org/v2/everything"
    params = {
        "q": "donald trump",      # Search query
        "sortBy": "publishedAt",  # Sort by the most recent
        "language": "en",         # Only English articles
        "apiKey": API_KEY,
    }
    
    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
    except Exception as e:
        print("Error fetching data from News API:", e)
        return

    # Parse the JSON response from the API
    data = response.json()
    articles = data.get("articles", [])
    news_items = []

    for article in articles:
        # Create a news item with a title, description, link, and timestamp
        item = {
            "title": article.get("title", "No Title"),
            "description": article.get("description", "No description available."),
            "link": article.get("url", "No link available"),
            "timestamp": article.get("publishedAt", time.strftime("%Y-%m-%d %H:%M:%S"))
        }
        news_items.append(item)

    # Save the scraped news items to a JSON file
    try:
        with open("trump_news.json", "w", encoding="utf-8") as f:
            json.dump(news_items, f, indent=2)
        print(f"Scraped {len(news_items)} items at {time.strftime('%Y-%m-%d %H:%M:%S')}")
    except Exception as e:
        print("Error writing JSON file:", e)

def job():
    scrape_trump_news()

if __name__ == "__main__":
    # Run the job immediately once
    job()
    # Schedule the job to run every 2 minutes
    schedule.every(2).minutes.do(job)
    
    while True:
        schedule.run_pending()
        time.sleep(1)
