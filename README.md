# n8n-nodes-devdeskapp

<p align="center">
  <img src="nodes/DevDeskApp/devdeskapp.svg" width="96" height="96" alt="DevDeskApp Logo" />
</p>

[![npm version](https://badge.fury.io/js/n8n-nodes-devdeskapp.svg)](https://www.npmjs.com/package/n8n-nodes-devdeskapp)
[![n8n community node](https://img.shields.io/badge/n8n-community%20node-orange.svg)](https://n8n.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Official [n8n](https://n8n.io/) community node for [DevDeskApp](https://www.devdeskapp.com) — access 330+ client-side developer utilities, converters, formatters, and financial calculators directly within your automated workflows.

---

## ⚡ Features & Supported Tools

* **JSON & Data Formatters:**
  * **Prettify / Format:** Indent single or nested payloads (2 spaces, 4 spaces, or Tabs).
  * **Minify:** Strip whitespace from messy payloads.
  * **Validate:** Validate syntax safely with line/character error diagnostics.
* **Cryptography & Security:**
  * **Cryptographic Hashes:** Generate MD5, SHA-1, SHA-256, and SHA-512 hashes.
  * **Base64 Encoding & Decoding:** Bidirectional UTF-8 / Base64 conversions.
  * **UUID Generator:** Generate RFC 4122 v4 UUIDs for tracing.
* **Text & Strings:**
  * **Slugify:** Clean strings into URL-safe, SEO-friendly slugs.
  * **Case Converter:** Convert between camelCase, kebab-case, snake_case, PascalCase, UPPERCASE, and lowercase.
* **HR & Financial Calculators:**
  * **CTC to In-Hand Calculator:** Convert annual package (CTC) into monthly in-hand net salary, statutory PF, professional tax, and estimated income tax deductions.
* **100% Local & Zero Latency:** Runs entirely in your local n8n execution environment with zero API costs, zero data transfer to external servers, and enterprise data privacy.

---

## 📁 Ready-to-Use Workflow Templates

Pre-built workflow templates are available in the [`templates/`](templates/) directory:

1. **[Webhook JSON Sanitizer & Security Hasher](templates/webhook-json-sanitizer.json):**
   * *Flow:* Webhook Ingest $\rightarrow$ JSON Prettify $\rightarrow$ SHA-256 Digest $\rightarrow$ UUID Tracing $\rightarrow$ Formatted Response.
2. **[Automated Candidate Offer & CTC Salary Breakdown](templates/employee-ctc-calculator.json):**
   * *Flow:* Candidate Input $\rightarrow$ Slugifier $\rightarrow$ In-Hand Salary Calculation $\rightarrow$ Formal Offer Letter Payload.

👉 **See the complete [TEMPLATES-GUIDE.md](TEMPLATES-GUIDE.md) for step-by-step import instructions and JSON output schemas.**

---

## 🚀 Installation

In your n8n self-hosted or cloud instance:

1. Go to **Settings > Community Nodes**.
2. Select **Install a community node**.
3. Enter `n8n-nodes-devdeskapp` in the **npm Package Name** field.
4. Agree to the risks of installing community packages and click **Install**.

---

## 🔒 Privacy & Security

DevDeskApp nodes process all inputs inside your local n8n runner container. No payloads, tokens, or outputs are ever transmitted to any external third-party servers.

---

## 🌐 Links & Resources

* **Web Utilities:** [https://www.devdeskapp.com](https://www.devdeskapp.com)
* **GitHub Repository:** [https://github.com/DevdeskApp/n8n-nodes-devdeskapp](https://github.com/DevdeskApp/n8n-nodes-devdeskapp)
* **Issues & Feature Requests:** [https://github.com/DevdeskApp/n8n-nodes-devdeskapp/issues](https://github.com/DevdeskApp/n8n-nodes-devdeskapp/issues)

---

## 📄 License

[MIT](LICENSE) © 2026 DevDeskApp Community
