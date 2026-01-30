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
