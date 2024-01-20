# Requirements

## Overview
Design and implement a simple program (in NodeJS over JS or TS) to:
crawl using puppeteer and combine a list of sponsored links by given keywords over google, bing and
yahoo.

## The program should be composed of the following modules:

1. The main module - holds REST API to seek in the web for sponsored links, the
available endpoints should be:
a. GET:: /api/v1/sponsored-links?pages={AMOUNT OF PAGES TO
CRAWL},keywords={LIST OF KEYWORDS SEPARATED WITH COMMA}

2. The worker - crawl the websites to combine this list

3. The aggregator - aggregates the results from all the workers and returns to the API

## Couple more things:
1. There should be several concurrent workers (i.e each keyword should crawl a
specific page for a specific keyword)
2. The results should be returned via REST API GET endpoint
3. Please provide README.md file which explains how to run the program and what to
expect

4. This task should be done alone. You can make use of any written or web resource
you find, incl. 3rd party libraries
5. The code should work, and be as clean and efficient as you think necessary
6. The code should be as fast as possible in manner of time

When done, please send the solution to the recruiter's mail.
Good Luck!