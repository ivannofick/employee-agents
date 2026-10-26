# Security Policy

`employee-agents` is an open-source, local-first framework designed to organize AI coding agents into a structured engineering squad. All templates, skills, and logic reside locally within your project repository.

---

## 🔒 Security Principles

### 1. Zero External Network Requests

`employee-agents` does NOT make unauthorized outbound HTTP requests, phone home, or transmit your source code, environment variables, or API keys to external telemetry servers. The CLI only interacts with your local file system to scaffold `/myemployee/` and relevant adapter files.

### 2. Brownfield Safety & Non-Destructive Inits

When initialized in an existing codebase (`"project_type": "existing"`):

- The CLI **never** overwrites, alters, or removes your existing application source code or dependency manifests (`package.json`, `composer.json`, `go.mod`, etc.).
- The system only creates the isolated `/myemployee/` directory and platform adapters.
- All agent roles follow strict **surgical line-editing constraints** (`file.ts:L20-L45`) to prevent accidental file wipes or unauthorized refactoring.

### 3. Transparent Driver Skills

The installed driver skill (e.g. `.agent/skills/myemployee/SKILL.md`) is a plain, human-readable Markdown file. It contains zero obfuscated binaries, shell scripts, or hidden commands. You can inspect every line of instruction before or after installation.

---

## 🛡️ Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

---

## 🚨 Reporting a Vulnerability

If you discover a security vulnerability or unexpected behavior within `employee-agents`, please report it directly and privately to the maintainers rather than opening a public issue.

- **Email**: `ivannofick@gmail.com`
- **GitHub Security Advisory**: Open a private advisory on [GitHub Advisories](https://github.com/ivannofick/employee-agents/security/advisories).

Please include:

1. Steps to reproduce the issue.
2. The operating system and Node.js version.
3. Expected vs observed behavior.

We take all security reports seriously and will acknowledge receipt within 48 hours and work with you on a timely resolution.
