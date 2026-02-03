# Data Extraction & Validation Using Regex (JavaScript)

## Project Overview

This project is a Node.js-based data extraction and validation program written in JavaScript. It processes raw, unstructured text (such as logs, API responses, or messy text files) and extracts structured information using regular expressions.

The program reads a text file, validates specific data patterns, and outputs the extracted valid data into a structured JSON file.

---

## Objectives

- Extract structured data from unstructured raw text using regular expressions
- Validate extracted data to ensure it follows correct formatting
- Ignore malformed or invalid patterns
- Organize extracted data into structured JSON format
- Demonstrate practical use of regex in real-world text processing

---

## Data Types Extracted

The program extracts and validates the following data types:

### Email Addresses
Examples:
john.doe@example.com
user@company.co.uk

### URLs
Examples:
https://www.example.com
https://subdomain.example.org/page

### Phone Numbers
Examples:
(123) 456-7890
123-456-7890
123.456.7890

### Credit Card Numbers
Examples:
1234 5678 9012 3456
1234-5678-9012-3456

(Only valid-length card numbers between 13–19 digits are accepted.)

### Time Formats
Examples:
14:30 (24 hour format)
2:30 PM (12 hour format)

### HTML Tags
Examples:
<p>
<div class="example">
<img src="image.jpg" alt="description">

### Hashtags
Examples:
#example
#ThisIsAHashtag

### Currency Amounts
Examples:
$19.99
$1,234.56

---

## How It Works

1. The program reads a text file provided as input.
2. It scans the entire file using predefined regular expressions.
3. It extracts only valid matches for each data type.
4. Duplicate values are removed.
5. The results are grouped by category.
6. The extracted data is written into a structured JSON file.

---

## Input

The input is a messy text file that contains:
- Valid data
- Invalid or malformed entries
- Mixed formatting
- Random text content

Example input file:
sample_input.txt

---

## Output Format

The program generates a JSON file containing structured extracted data.

Example output structure:

{
  "emails": [],
  "urls": [],
  "phones": [],
  "credit_cards": [],
  "times": [],
  "html_tags": [],
  "hashtags": [],
  "currency_dollars": []
}

Only valid matches are included. Invalid or malformed entries are excluded.

Default output file:
extracted.json

---

## Technologies Used

Language: JavaScript (Node.js)
Core Concept: Regular Expressions (Regex)
File Handling: Node.js fs module
Data Format: JSON

---

## How to Run the Program

Make sure Node.js is installed on your system.

Run the program using:

node extract.js input.txt output.json

If no output file is specified, the program will generate:

extracted.json

---

## Project Structure

regex-data-extraction/
│
├── README.md
├── extract.js
├── sample_input.txt
├── extracted.json

---

## Notes

- All regex patterns were manually written.
- The program focuses on structured data extraction from unstructured text.
- The project demonstrates backend text processing using JavaScript.
- No frontend interface is included this is a commandline tool.

---

## Author

Suwafa Iradukunda
Bachelor in Entrepreneurial Leadership (BEL)
student at African Leadership University

