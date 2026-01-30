// extract.js
// Use this command:
//   node extractor.js sample_input.txt output.json
// output.json is optional; defaults to extracted.json
 
// Reads input.txt, extracts valid data (emails, URLs, phones, credit cards,
// times, HTML tags, hashtags, currency amounts) using regular expressions,
// and writes a JSON file with unique matches for each category.
 
// Notes:
//  - This script uses regex-based validation as requested. Some data types
//    (e.g., credit card numbers) can be further validated (Luhn), but here
//    I rely on regex + length checks.


const fs = require('fs');
const path = require('path');

const inputPath = process.argv[2];
const outputPath = process.argv[3] || 'extracted.json';

if (!inputPath) {
  console.error('Use: node extractor.js sample_input.txt [output.json]');
  process.exit(1);
}

let text;
try {
  text = fs.readFileSync(inputPath, 'utf8');
} catch (err) {
  console.error('Failed to read input file:', err.message);
  process.exit(1);
}


// This are the regex patterns that catch different data based on the matching patterns.

const patterns = {
  emails: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,

  // matches http/https URLs
  urls: /\bhttps?:\/\/[^\s)'"<>{}]+\b/gi, 

  // phone numbers valid for different formats with optional country code, 
  // area code in parentheses, separators
  phones: /\b(?:\+?\d{1,3}[-.\s]?)?(?:\(\d{2,4}\)|\d{2,4})[-.\s]?\d{2,4}[-.\s]?\d{2,5}\b/g,

  // credit cards: groups of digits with optional spaces/dashes, 13-19 digits total
  credit_cards: /\b(?:\d[ -]*?){13,19}\b/g,

  // times: 24-hour (HH:MM) and 12-hour with AM/PM
  times_24h: /\b([01]\d|2[0-3]):[0-5]\d\b/g,
  times_12h: /\b(0?[1-9]|1[0-2]):[0-5]\d\s?(?:AM|PM|am|pm)\b/g,

  // HTML tags (simple match)
  html_tags: /<("[^"]*"|'[^']*'|[^'">])*>/g,

  // hashtags (letters, numbers, underscore)
  hashtags: /#\w+/g,

  // currency amounts with $ symbol (examples provided use $)
  currency_dollars: /\$\s?\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?\b/g,
};
