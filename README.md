# Sponsored Links Crawler

## Description
This NodeJS application uses Puppeteer to crawl Google, Bing, and Yahoo for sponsored links based on provided keywords.

## Installation
1. Clone the repository
2. Run `npm install` to install dependencies

## Usage
1. Start the server with `node server.js`
2. Make a GET request to `http://localhost:3000/api/v1/sponsored-links?pages=[PAGES_TO_CRAWL]&keywords=[KEYWORDS]`
   - Replace `[PAGES_TO_CRAWL]` with the number of pages to crawl
   - Replace `[KEYWORDS]` with a comma-separated list of keywords

## Output
The response will be a JSON object containing the aggregated results of sponsored links from the specified search engines and keywords.
