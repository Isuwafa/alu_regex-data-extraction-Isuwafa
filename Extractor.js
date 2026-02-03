// extract.js
// Use this command:
//   node extractor.js sample_input.txt output.json
// output.json is optional; defaults to extracted.json
 
// Reads input.txt, extracts valid data (emails, URLs, phones, credit cards,
// times, HTML tags, hashtags, currency amounts) using regular expressions,
// and writes a JSON file with unique matches for each category.
 
// Notes:
//   This script uses regex based validation as requested. Some data types
//    (e.g., credit card numbers) can be further validated (Luhn), but here
//    I rely on regex + length checks.


const fs = require('fs');
const path = require('path');

const inputfile = process.argv[2];
const outputFile = process.argv[3] || 'extracted.json';

if (!inputfile) {
  console.error('Use: node extractor.js sample_input.txt [output.json]');
  process.exit(1);
}

let inputText;
try {
  inputText = fs.readFileSync(inputfile, 'utf8');
} catch (err) {
  console.error('Failed to read input file:', err.message);
  process.exit(1);
}


// These are the regex patterns that get different data based on the matching patterns.

const regexes = {
  emails: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,

  // matches http/https URLs
  URL: /https?:\/\/(?:www\.)?[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}(?:\/[^\s]*)?/g,

  // Phone numbers valid for different formats with optional country code, area code in parentheses, separators
  Phone: /(?:\+\d{1,3}[-.\s]?)?(?:\(\d{3}\)|\d{3})[-.\s]?\d{3}[-.\s]?\d{4}\b/g,

  // credit cards: groups of digits with optional spaces/dashes, 13-19 digits total
  credit_cards: /\b(?:\d{4}[-\s]?){3}\d{4}\b|\b\d{4}[-\s]?\d{6}[-\s]?\d{5}\b/g,

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


 // helper  dedupe and sort matches
 
function getUniqueList(array) {
  return Array.from(new Set(array)).sort();
}


 // doing extraction using a regex. If pattern is null or not global, ensure global.
 
function findAllMatches(text, re) {
  if (!re) return [];
  const flags = re.flags.includes('g') ? re.flags : re.flags + 'g';
  const gRe = new RegExp(re.source, flags);
  const out = [];
  let match;
  while ((match = gRe.exec(text)) !== null) {
    out.push(match[0].trim());
  }
  return out;
}

const extractedData = {};

// emails
extractedData.emails = getUniqueList(findAllMatches(inputText, regexes.emails));

// urls
extractedData.URL = getUniqueList(findAllMatches(inputText, regexes.URL));

// phones: further normalize (strip spaces/dots) but keep displayed format as found
extractedData.Phone = getUniqueList(findAllMatches(inputText, regexes.Phone));

// credit cards: use regex to get the  candidate strings, then normalize digits only and keep those with length 13-19
const validCards = findAllMatches(inputText, regexes.credit_cards);
const cleanCards = validCards
  .map(s => s.replace(/[^\d]/g, ''))          // remove non-digits
  .filter(d => d.length >= 13 && d.length <= 19)
  .map(d => {
    // present in groups of 4 for readability if length 16; otherwise keep digits
    if (d.length === 16) return d.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
    if (d.length === 15) return d.replace(/(\d{4})(\d{6})(\d{5})/, '$1 $2 $3');
    return d;
  });
extractedData.credit_cards = getUniqueList(cleanCards);

// times: combine 24h and 12h, dedupe
extractedData.times = getUniqueList([
  ...findAllMatches(inputText, regexes.times_24h),
  ...findAllMatches(inputText, regexes.times_12h),
]);

// html tags
extractedData.html_tags = getUniqueList(findAllMatches(inputText, regexes.html_tags));

// hashtags
extractedData.hashtags = getUniqueList(findAllMatches(inputText, regexes.hashtags));

// currency amounts ($)
extractedData.currency_dollars = getUniqueList(findAllMatches(inputText, regexes.currency_dollars));

// optionally: remove false positives (very short matches etc.)
// (Not actually included here regex selection and post filters above should be enough for most cases)

try {
  fs.writeFileSync(outputFile, JSON.stringify(extractedData, null, 2), 'utf8');
  console.log(`Extraction complete. Results saved to: ${path.resolve(outputFile)}`);
  console.log('Summary:');
  for (const k of Object.keys(extractedData)) {
    console.log(`  ${k}: ${extractedData[k].length}`);
  }
} catch (err) {
  console.error('Failed to write output file:', err.message);
  process.exit(1);
}
