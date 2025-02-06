// Global array to store all news items that have been loaded
let allNews = [];

// Helper function to format a timestamp into a readable format with AM/PM
function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  if (isNaN(date)) return timestamp;
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true
  });
}

// Helper function to generate a unique identifier for each news item
function getNewsId(item) {
  // Combine title and timestamp (assumes this is unique)
  return `${item.title}_${item.timestamp}`;
}

// Function to render (or re-render) the news items on the page
function renderNews() {
  const timelineContainer = document.getElementById('timeline');
  // Clear the container so we can re-render the filtered list
  timelineContainer.innerHTML = '';

  // Get the current filter (if any)
  const filterKeyword = document.getElementById('keyword').value.toLowerCase();

  // Sort news items so that the newest appear first
  allNews.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  // Loop through all news items and display those that match the filter
  allNews.forEach(item => {
    // If a filter is active and this item doesn't match, skip it
    if (
      filterKeyword &&
      !item.title.toLowerCase().includes(filterKeyword) &&
      !item.description.toLowerCase().includes(filterKeyword)
    ) {
      return;
    }
    
    // Create the DOM elements for a news item
    const itemDiv = document.createElement('div');
    itemDiv.className = 'timeline-item';
    itemDiv.setAttribute('data-id', getNewsId(item));

    const titleEl = document.createElement('h3');
    titleEl.textContent = item.title;

    const timestampEl = document.createElement('p');
    timestampEl.innerHTML = `<strong>Date:</strong> ${formatTimestamp(item.timestamp)}`;

    const descriptionEl = document.createElement('p');
    descriptionEl.textContent = item.description;

    const linkEl = document.createElement('a');
    linkEl.href = item.link;
    linkEl.target = '_blank';
    linkEl.textContent = 'Read more';

    // Append elements to the item container
    itemDiv.appendChild(titleEl);
    itemDiv.appendChild(timestampEl);
    itemDiv.appendChild(descriptionEl);
    itemDiv.appendChild(linkEl);

    // Append the news item to the timeline
    timelineContainer.appendChild(itemDiv);
  });
}

// Function to fetch news from the JSON file and update the global news list
function fetchNews() {
  fetch('trump_news.json')
    .then(response => response.json())
    .then(data => {
      let newItemsAdded = false;
      // Loop through each item fetched from the JSON file
      data.forEach(item => {
        const id = getNewsId(item);
        // Check if this news item is already in our global list
        if (!allNews.some(news => getNewsId(news) === id)) {
          allNews.push(item);
          newItemsAdded = true;
        }
      });
      // If new items were added, re-render the timeline
      if (newItemsAdded) {
        renderNews();
      }
    })
    .catch(error => {
      console.error('Error fetching JSON data:', error);
      // Optionally, you can display an error message in the timeline here.
    });
}

// Set up the filter button to re-render news based on the filter input
document.getElementById('applyFilter').addEventListener('click', renderNews);

// Initial fetch when the page loads
fetchNews();

// Auto-refresh: fetch new news every 5 minutes (300,000 milliseconds)
setInterval(fetchNews, 300000);
