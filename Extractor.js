/**
 * extractor.js
 * 
 * This script extracts structured data from raw text using regular expressions.
 * It demonstrates validation of untrusted input and basic security practices
 * such as rejecting malformed data and masking sensitive information.
 */
const fs = require('fs');

// 1. Read input text from file
const rawText = fs.readFileSync("sample_input.txt", "utf-8");

console.log("=== RAW INPUT TEXT ===");
console.log(rawText);

// 2. Placeholder arrays for extracted datagit 
const emails = [];
const urls = [];
const phoneNumbers = [];
const creditCards = [];

// 3. Regular expressions for data extraction
const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const urlRegex = /https?:\/\/[^\s/$.?#].[^\s]*/g;
const phoneRegex = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g;
const creditCardRegex = /\b(?:\d[ -]*?){13,16}\b/g; 
