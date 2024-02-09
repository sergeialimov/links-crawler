# Sponsored Links Crawler

## Overview
The Sponsored Links Crawler is a NodeJS application designed to crawl sponsored links from Google, Bing, and Yahoo based on user-provided keywords. It leverages the power of Puppeteer, a Node library which provides a high-level API to control Chrome or Chromium over the DevTools Protocol.

## Getting Started

### Prerequisites
- Node.js installed on your machine
- Yarn package manager

### Installation
1. Clone the repository to your local machine using `git clone git@github.com:sergeialimov/links-crawler.git`.
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


Example:
```json
{
    "data": [
        {
            "searchEngine": "GOOGLE",
            "keyword": "buy iphone tbilisi",
            "sponsoredLinks": [
                {
                    "page": 1,
                    "links": [
                        "https://ispace.ge/iphone/iphone-12/iphone-12-128-gb-black-mgja3rma",
                        "https://veli.store/en/details/apple-iphone-15-6-gb-256-gb-green/?sku=195949037566",
                        "https://cosmo.ge/product/apple-iphone-12-64gb-bluemeoradi",
                        "https://ispace.ge/iphone/iphone-14-pro/iphone-14-pro-512-gb-space-black-mq1m3hxa",
                        "https://zoommer.ge/en/mobile-phones/apple-iphone-14-pro-256gb-space-black-p20101",
                        "https://ispace.ge/iphone/iphone-14/iphone-14-128-gb-midnight-mpuf3hxa",
                        "https://zoommer.ge/en/mobile-phones/apple-iphone-14-128gb-purple-p32570"
                    ]
                }
            ]
        },
        {
            "searchEngine": "YAHOO",
            "keyword": "buy iphone tbilisi",
            "sponsoredLinks": [
                {
                    "page": 1,
                    "links": []
                }
            ]
        },
        {
            "searchEngine": "BING",
            "keyword": "buy iphone tbilisi",
            "sponsoredLinks": [
                {
                    "page": 1,
                    "links": [
                        "https://www.walmart.com/cell phones"
                    ]
                }
            ]
        }
    ]
}
```