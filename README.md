# Data Extraction & Secure Validation Using Regex (Python)

## Project Overview
This project is a regex-based data extraction and validation program written in Python. It processes raw text data similar to what might be returned from an external API and extracts structured information in a safe and reliable manner.

The project focuses on accuracy, robustness, and basic security awareness when handling untrusted input.

---

##  Objectives
- Extract structured data from unstructured raw text using   regular expressions
- Validate extracted data to ensure it is well-formed
- Reject or ignore malformed and potentially unsafe input
- Prevent unnecessary exposure of sensitive information in outputs

---

##  Data Types Extracted
The program extracts and validates the following data types:

- **Email addresses**  
  Example formats:  
  `john.doe@example.com`, `user@company.co.uk`

- **URLs**  
  Example formats:  
  `https://www.example.com`, `http://sub.domain.org/page`

- **Phone numbers**  
  Example formats:  
  `(123) 456-7890`, `123-456-7890`, `123.456.7890`, `+250 788 123 456`

- **Credit card numbers**  
  Example formats:  
  `1234 5678 9012 3456`, `1234-5678-9012-3456`

---

##  Security Considerations
This program assumes that not all input is trustworthy. To demonstrate security awareness:

- Malformed or invalid patterns are ignored
- Unsafe URL schemes (such as `javascript:`) are rejected
- Emails without valid domains are excluded
- Credit card numbers are masked in the output to prevent sensitive data exposure
- Sensitive data is not unnecessarily logged or printed in full

---

##  Input Design
The input consists of realistic, messy raw text that resembles production logs or API responses.  
It includes:
- Valid data
- Invalid and malformed entries
- Mixed formatting and spacing
- Suspicious or hostile strings

A sample input file is provided:
sample_input.txt

yaml
Copy code

---

##  Output Format
The extracted data is displayed in a structured and readable format, grouped by data type.  
Invalid or unsafe entries are excluded from the output.

A sample output is provided:
sample_output.txt

yaml
Copy code

---

##  Technologies Used
- **Language:** Python 3
- **Core Concept:** Regular Expressions (Regex)

---

## How to Run the Program
Make sure Python 3 is installed on your system.

Run the program using:
python main.py

yaml
Copy code

---

##  Project Structure
alu_regex-data-extraction-yourusername/
│
├── README.md
├── main.py
├── sample_input.txt
├── sample_output.txt

yaml
Copy code

---

##  Notes
- All regex patterns and validation logic were written manually
- The program emphasizes defensive handling of untrusted input
- No user interface is included, as the focus is on regex extraction and validation logic

---

##  Author
Suwafa Iradukunda  

