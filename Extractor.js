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

  // phone numbers valid for different formats with optional country code, area code in parentheses, separators
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

/**
 * helper: dedupe and sort matches
 */
function unique(arr) {
  return Array.from(new Set(arr)).sort();
}

/**
 * Extract using a regex. If pattern is null or not global, ensure global.
 */
function extractAll(text, re) {
  if (!re) return [];
  const flags = re.flags.includes('g') ? re.flags : re.flags + 'g';
  const gRe = new RegExp(re.source, flags);
  const out = [];
  let m;
  while ((m = gRe.exec(text)) !== null) {
    out.push(m[0].trim());
  }
  return out;
}

const results = {};

// emails
results.emails = unique(extractAll(text, patterns.emails));

// urls
results.urls = unique(extractAll(text, patterns.urls));

// phones: further normalize (strip spaces/dots) but keep displayed format as found
results.phones = unique(extractAll(text, patterns.phones));

// credit cards: use regex to capture candidate strings, then normalize digits-only and keep those with length 13-19
const rawCCs = extractAll(text, patterns.credit_cards);
const normalizedCCs = rawCCs
  .map(s => s.replace(/[^\d]/g, ''))          // remove non-digits
  .filter(d => d.length >= 13 && d.length <= 19)
  .map(d => {
    // present in groups of 4 for readability if length 16; otherwise keep digits
    if (d.length === 16) return d.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
    if (d.length === 15) return d.replace(/(\d{4})(\d{6})(\d{5})/, '$1 $2 $3');
    return d;
  });
results.credit_cards = unique(normalizedCCs);

// times: combine 24h and 12h, dedupe
results.times = unique([
  ...extractAll(text, patterns.times_24h),
  ...extractAll(text, patterns.times_12h),
]);

// html tags
results.html_tags = unique(extractAll(text, patterns.html_tags));

// hashtags
results.hashtags = unique(extractAll(text, patterns.hashtags));

// currency amounts ($)
results.currency_dollars = unique(extractAll(text, patterns.currency_dollars));

// optionally: remove false positives (very short matches etc.)
// (Not included here - regex selection and post-filters above should be enough for most cases)

try {
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), 'utf8');
  console.log(`Extraction complete. Results saved to: ${path.resolve(outputPath)}`);
  console.log('Summary:');
  for (const k of Object.keys(results)) {
    console.log(`  ${k}: ${results[k].length}`);
  }
} catch (err) {
  console.error('Failed to write output file:', err.message);
  process.exit(1);
}
