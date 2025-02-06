// script.js

// Function to fetch and render the news data from the JSON file.
function renderTimeline(filterKeyword = '') {
    fetch('trump_news.json')
      .then(response => response.json())
      .then(data => {
        const timelineContainer = document.getElementById('timeline');
        timelineContainer.innerHTML = '';
  
        // Optionally filter the items based on the provided keyword (in title or description)
        const filteredData = filterKeyword
          ? data.filter(item =>
              item.title.toLowerCase().includes(filterKeyword.toLowerCase()) ||
              item.description.toLowerCase().includes(filterKeyword.toLowerCase())
            )
          : data;
  
        // Sort by timestamp descending (newest first)
        filteredData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
        if(filteredData.length === 0) {
          timelineContainer.innerHTML = '<p>No news items match this filter.</p>';
          return;
        }
  
        filteredData.forEach(item => {
          const itemDiv = document.createElement('div');
          itemDiv.className = 'timeline-item';
  
          const title = document.createElement('h3');
          title.textContent = item.title;
  
          const timestamp = document.createElement('p');
          timestamp.innerHTML = `<strong>Date:</strong> ${item.timestamp}`;
  
          const description = document.createElement('p');
          description.textContent = item.description;
  
          const link = document.createElement('a');
          link.href = item.link;
          link.target = '_blank';
          link.textContent = 'Read more';
  
          itemDiv.appendChild(title);
          itemDiv.appendChild(timestamp);
          itemDiv.appendChild(description);
          itemDiv.appendChild(link);
  
          timelineContainer.appendChild(itemDiv);
        });
      })
      .catch(error => {
        console.error('Error fetching JSON data:', error);
        document.getElementById('timeline').innerHTML = '<p>Error loading data.</p>';
      });
  }
  
  // Set up filter button event listener
  document.getElementById('applyFilter').addEventListener('click', () => {
    const keyword = document.getElementById('keyword').value;
    renderTimeline(keyword);
  });
  
  // Initially load all data without filtering
  renderTimeline();
  