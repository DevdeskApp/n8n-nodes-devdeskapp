# n8n-nodes-devdeskapp

<p align="center">
  <img src="https://raw.githubusercontent.com/DevdeskApp/n8n-nodes-devdeskapp/master/nodes/DevDeskApp/devdeskapp.svg" width="96" height="96" alt="DevDeskApp Logo" />
</p>

<p align="center">
  <strong>Official n8n Community Node for DevDeskApp developer utilities, data converters, and calculators.</strong>
</p>

<p align="center">
  <a href="https://docs.devdeskapp.com"><img src="https://img.shields.io/badge/docs-docs.devdeskapp.com-6366f1.svg" alt="Documentation" /></a>
  <a href="https://n8n.io/workflows/21017-format-json-and-secure-hr-payloads-with-devdeskapp-utilities"><img src="https://img.shields.io/badge/n8n.io-Template_%2321017-10b981.svg" alt="Template #21017" /></a>
  <a href="https://www.npmjs.com/package/n8n-nodes-devdeskapp"><img src="https://img.shields.io/npm/v/n8n-nodes-devdeskapp.svg" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/n8n-nodes-devdeskapp"><img src="https://img.shields.io/npm/dm/n8n-nodes-devdeskapp.svg" alt="npm downloads" /></a>
  <a href="https://n8n.io"><img src="https://img.shields.io/badge/n8n-community%20node-orange.svg" alt="n8n community node" /></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT" /></a>
</p>

---

## Overview

[DevDeskApp](https://www.devdeskapp.com) provides 330+ client-side developer utilities, converters, formatters, and financial calculators.

👉 **Official Documentation Portal**: [https://docs.devdeskapp.com](https://docs.devdeskapp.com)  
👉 **Live n8n Template #21017**: [Format JSON & Secure HR Payloads with DevDeskApp](https://n8n.io/workflows/21017-format-json-and-secure-hr-payloads-with-devdeskapp-utilities)  
👉 **AI Agents & LLM Function Calling**: [AI Agent Guide](https://docs.devdeskapp.com/solutions/ai-agents)

This official community node integrates these utilities directly into your automated [n8n](https://n8n.io) workflows, executing 100% locally with zero external API calls, zero latency, and complete data privacy.

---

## Operations & Capabilities

| Resource | Operation | Description |
| :--- | :--- | :--- |
| **JSON Utility** | **Prettify / Format** | Format raw or minified JSON with customizable 2-space, 4-space, or Tab indentation |
| **JSON Utility** | **Minify** | Strip whitespace from JSON payloads for compact storage and faster network payloads |
| **JSON Utility** | **Validate** | Validate JSON structure safely and return syntax diagnostics without failing workflows |
| **Crypto & Hash** | **Hash** | Generate cryptographic hashes: MD5, SHA-1, SHA-256, and SHA-512 |
| **Crypto & Hash** | **Base64 Encode** | Encode plain UTF-8 text strings into Base64 strings |
| **Crypto & Hash** | **Base64 Decode** | Decode Base64 strings back to clean UTF-8 text |
| **Crypto & Hash** | **UUID v4** | Generate cryptographically secure RFC 4122 v4 UUID identifiers |
| **Text & String** | **Slugify String** | Convert text strings into clean, lowercase, URL-safe SEO slugs |
| **Text & String** | **Case Converter** | Convert casing to camelCase, kebab-case, snake_case, PascalCase, Uppercase, or Lowercase |
| **Text & String** | **URL Encode** | Encode text into RFC 3986 percentage-encoded strings for URL queries and payloads |
| **Text & String** | **URL Decode** | Decode percentage-encoded URL strings back to readable UTF-8 text |
| **HR & Calculator** | **CTC to In-Hand** | Compute Indian income tax, standard deductions, EPF, professional tax, and net monthly take-home salary from annual CTC |

---

## Prerequisites

- **n8n**: Version 1.0.0 or later (tested up to v2.8.4+)
- **Node.js**: Version 18.x or later (for self-hosted environments)
- **Authentication**: No external credentials or API keys required. All operations run directly in your local execution environment.

---

## Installation

### Method 1: Community Nodes (Recommended)

1. Open your n8n workspace.
2. Navigate to **Settings** > **Community Nodes**.
3. Select **Install a community node**.
4. In the **npm Package Name** field, enter:
   ```text
   n8n-nodes-devdeskapp
   ```
5. Check the agreement checkbox and click **Install**.
6. Search for `DevDeskApp` in the node palette to add it to any workflow.

### Method 2: Docker / Self-Hosted

If running n8n via Docker, mount the community nodes folder or install into your custom nodes directory:

```bash
docker exec -u node -it n8n-container npm install n8n-nodes-devdeskapp
```

Or add to your `Dockerfile`:

```dockerfile
USER node
RUN cd ~/.n8n/nodes && npm install n8n-nodes-devdeskapp
```

---

## Usage Example

### Formatting Webhook Payloads and Creating Traced Records

1. Add a **Webhook** node to receive incoming data.
2. Connect the **DevDeskApp** node:
   - **Resource**: `JSON Utility`
   - **Operation**: `Prettify / Format`
   - **JSON Input**: `={{ $json.body }}`
   - **Indentation**: `2 Spaces`
3. Connect a second **DevDeskApp** node:
   - **Resource**: `Crypto & Hash`
   - **Operation**: `UUID v4`
4. Use the resulting formatted payload and unique UUID in your downstream database, Slack, or email notifications.

---

## Privacy & Security

- **100% Local Execution**: All computations (formatting, hashing, encoding, salary calculations) run strictly inside your n8n instance.
- **Zero External Telemetry**: No payload data, tokens, or execution logs are ever transmitted to DevDeskApp or any third-party service.
- **OIDC Provenance**: Official packages are built and signed with cryptographic Sigstore Provenance directly through GitHub Actions.

---

## Resources & Links

- 📖 **Documentation Portal**: [https://docs.devdeskapp.com](https://docs.devdeskapp.com)
- 🌟 **Official n8n Template #21017**: [https://n8n.io/workflows/21017](https://n8n.io/workflows/21017-format-json-and-secure-hr-payloads-with-devdeskapp-utilities)
- 🤖 **AI Agents & LLM Function Calling**: [https://docs.devdeskapp.com/solutions/ai-agents](https://docs.devdeskapp.com/solutions/ai-agents)
- 🌐 **Web Utilities Suite**: [https://www.devdeskapp.com](https://www.devdeskapp.com)
- 🐙 **GitHub Repository**: [https://github.com/DevdeskApp/n8n-nodes-devdeskapp](https://github.com/DevdeskApp/n8n-nodes-devdeskapp)
- 💬 **n8n Community Forum**: [https://community.n8n.io](https://community.n8n.io)
- 🐛 **Issue Tracker**: [https://github.com/DevdeskApp/n8n-nodes-devdeskapp/issues](https://github.com/DevdeskApp/n8n-nodes-devdeskapp/issues)

---

## License

[MIT](LICENSE) (c) 2026 DevDeskApp Community
