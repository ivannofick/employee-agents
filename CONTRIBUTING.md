# Contributing to employee-agents

First off, thank you for considering contributing to `employee-agents`! It's people like you who make this a fun, structured, and slop-free framework for the entire developer community.

---

## 🛠️ Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ivannofick/employee-agents.git
   cd employee-agents
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Compile TypeScript**:
   ```bash
   npm run build
   ```

4. **Run CLI in development**:
   ```bash
   npm run dev
   # or with Indonesian language:
   npm run dev -- --lang id
   ```

---

## 🏗️ How to Add a New Platform Adapter

Adapters live in `adapters/<platform-name>/`:

1. Create a new directory under `adapters/` (e.g. `adapters/cursor/`).
2. Add your driver template:
   - For Cursor: `.cursorrules` or `.cursor/rules/myemployee.mdc`.
   - For Claude Code: `CLAUDE.md`.
   - For Cline: `.clinerules`.
3. In `src/core/generator.ts`, register your adapter copying logic when the user selects that environment.
4. Remove the `(Coming Soon)` label from `src/i18n/locales/en.ts` and `src/i18n/locales/id.ts`.

---

## 🧑‍🍳 How to Add Skills to a Role

Each employee's capabilities live under `templates/myemployee/roles/<role-name>/skill/`:

1. Create a new markdown file (e.g. `templates/myemployee/roles/tech-lead/skill/security-audit.md`).
2. Register the skill inside `templates/myemployee/roles/<role-name>/role.md` under `- **Active Skills**:`.
3. Ensure all skill procedures are written in **100% English**.

---

## 📜 Pull Request Guidelines

- Follow existing code style and TypeScript conventions.
- Keep commits descriptive (e.g. `feat: add cursor adapter`, `fix: handle missing prd template`).
- Ensure `npm run build` succeeds with zero errors.
- Do NOT commit `.agent/` or `openspec/` directories.
