# Sponsored Links Crawler

## Overview
The Sponsored Links Crawler is a NodeJS application designed to crawl sponsored links from Google, Bing, and Yahoo based on user-provided keywords. It leverages the power of Puppeteer, a Node library which provides a high-level API to control Chrome or Chromium over the DevTools Protocol.

## Getting Started

### Prerequisites
- Node.js installed on your machine
- Yarn package manager

### Installation
1. Clone the repository to your local machine using `git clone [repository_url]`.
2. Navigate to the project directory.
3. Run `yarn install` to install the necessary dependencies.

## Usage

### Starting the Server
1. Start the server by running `yarn start` in your terminal.

### Making Requests
1. Make a GET request to the following URL: `http://localhost:3000/api/v1/sponsored-links?pages=[PAGES_TO_CRAWL]&keywords=[KEYWORDS]`
   - Replace `[PAGES_TO_CRAWL]` with the number of pages you wish to crawl.
   - Replace `[KEYWORDS]` with a comma-separated list of keywords you want to search for.

## Output
The server will respond with a JSON object containing the aggregated results of sponsored links from the specified search engines and keywords.
