# Changelog

All notable changes to the `n8n-nodes-devdeskapp` package will be documented in this file.

---

## [0.1.2] - 2026-10-15

### Added
- **Manual Release Dispatch & CI/CD Automation**:
  - Implemented manual `workflow_dispatch` trigger in `publish.yml` allowing authorized maintainers to publish any git tag directly to NPM Registry with OIDC Sigstore Provenance.
  - Added multi-branch automated CI pipeline (`ci.yml`) validating builds, asset bundling, and test suites across `main` and `master` branches on push and pull requests.
- **Enterprise Release Pipeline Standardization**:
  - Full local end-to-end compatibility validation with running local n8n instance (v2.8.4) and DevDeskApp dev server.
  - Standardized semantic version tagging, package synchronization, and clean repository release metadata.

## [0.1.1] - 2026-10-15

### Added
- **URL Encoding & Decoding Operations**:
  - **URL Encode**: Converts raw strings into RFC 3986 percentage-encoded strings suitable for query parameters and webhook payload transmission.
  - **URL Decode**: Converts URL percentage-encoded strings back to clean UTF-8 text with robust error handling for malformed sequences.
- Extended unit test suite to 13 automated tests covering 100% of node operations.

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
