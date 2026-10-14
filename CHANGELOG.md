# Changelog

All notable changes to the `n8n-nodes-devdeskapp` package will be documented in this file.

---

## [0.1.0] - 2026-10-15

### Added
- **Initial Official Release** of `n8n-nodes-devdeskapp` community node for n8n.
- **10 Core Developer & Financial Operations**:
  - **JSON Prettifier**: Format raw or unformatted JSON strings with customizable indentation (2 spaces, 4 spaces, tabs).
  - **JSON Minifier**: Compact and strip unnecessary whitespace from JSON payloads for optimized network transmission.
  - **JSON Validator**: High-speed validation of JSON strings with actionable syntax and lint error diagnostics.
  - **SHA-256 Generator**: Cryptographic SHA-256 hash generation with Hex and Base64 output digests.
  - **MD5 Generator**: Legacy checksum and fingerprint generation with Hex and Base64 output digests.
  - **Base64 Encoder**: Robust UTF-8 text to Base64 encoding.
  - **Base64 Decoder**: Base64 to clean UTF-8 text decoding.
  - **UUID v4 Generator**: Cryptographically secure random UUID v4 generation with configurable batch/count generation.
  - **Text Slugify**: URL-safe slug generator with lowercase normalization and character sanitization.
  - **Text Case Converter**: Transform string casing to `camelCase`, `snake_case`, `kebab-case`, `UPPERCASE`, `lowercase`, or `Title Case`.
  - **CTC to In-Hand Salary Calculator**: Comprehensive Indian income tax and monthly in-hand salary computation for FY 2024-25 / 2025-26 (New Regime), including standard deduction (₹75,000), Section 87A tax rebate up to ₹7,00,000 taxable income, 4% Health & Education cess, and statutory EPF deductions.
- **Vector Brand Icon**:
  - High-resolution SVG icon (`devdeskapp.svg`) bundled into node distribution, featuring the official neon cyan-blue glowing diamond with `</>` code brackets.
- **Automated Unit Test Suite**:
  - Standalone automated test runner (`test-node.js`) verifying all operations and calculations without external runtime dependencies.
- **CI/CD Automation**:
  - GitHub Actions pipeline for automated linting, building, and unit testing on every push to `main`.
  - Automated release workflow with Sigstore Provenance attestation when publishing tags matching `v*`.
