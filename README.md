# 🏢 Employee-Agents

> **The Bikini Bottom Tech Squad**: A standalone virtual multi-role engineering squad adapting native spec-driven workflows for AI coding assistants.

---

## 🌟 Overview

`employee-agents` transforms your AI coding assistant from a solo code-generator into an autonomous, 6-role software engineering squad. It adapts the rigorous principles of **Spec-Driven Development** (PRD ➔ Architecture Design ➔ Actionable Tasks ➔ Implementation ➔ QA Verification) natively inside your repository without requiring external CLI dependencies.

### 👥 The Squad Roster

| Role (Directory) | Persona | Persona Call to User | Mission |
|---|---|---|---|
| **Founder / CEO** | **User** | **"Bos"** | Sets the vision, reviews progress, and makes executive decisions. |
| **`product-owner`** | **Patrick** | "Bos" | Researches user needs, drafts Feature PRDs, and defines Acceptance Criteria. |
| **`ui-ux`** | **Squidward** | "Bos" | Aesthetics, design tokens, responsive layout reflows, and wireframes (zero visual slop). |
| **`tech-lead`** | **Garry** | "Bos" | System architecture, ADRs, stack enforcement, and code review standards. |
| **`project-manager`** | **Sandy Cheeks** | "Bos" | Precise task breakdowns (file:line ranges), bug tickets, and `[DONE]-*` marking. |
| **`developer`** | **Tn. Crab** | "Bos" | Efficient, clean code execution, minimal resource/token usage, surgical edits. |
| **`qa`** | **Stanley** | "Bos" | Destructive testing, edge-case breaker, and brownfield regression shield. |

---

## 🚀 Quick Start

Initialize the squad in your workspace:

```bash
# Default (English prompt wizard)
npx employee-agents init

# Or with Indonesian language prompt wizard
npx employee-agents init --lang id
```

### 3-Step Setup Wizard
1. **Target AI Environment**: Antigravity *(Cursor, Claude Code, Cline, Windsurf Coming Soon)*.
2. **Project Type**: 
   - `New Project`: Greenfield application built from scratch.
   - `Existing Codebase`: Brownfield application (100% non-destructive, zero code disruption).
3. **Project Name**: Confirmation of your project name.

---

## 📁 Workspace Structure (`/myemployee/`)

```text
myemployee/
├── PRD.md                         # Master Product Requirements Document (North Star)
├── config.json                    # Workspace configuration & active AI environment
│
├── features/                      # Modular Feature PRDs created by Patrick (PO)
│   └── <feature-slug>/PRD.md
│
├── tasks/                         # Task checklists created by Sandy Cheeks (PM)
│   ├── features/                  # TASK-DDMMYYYY-<slug>.md
│   └── bugs/                      # BUG-DDMMYYYY-<slug>.md
│
└── roles/                         # Modular Role Definitions & Capabilities
    ├── product-owner/
    │   ├── role.md                # Persona: Patrick
    │   └── skill/default-skill.md # PRD & User Story drafting
    ├── ui-ux/
    │   ├── role.md                # Persona: Squidward
    │   └── skill/default-skill.md # Design tokens & wireframes
    ├── tech-lead/
    │   ├── role.md                # Persona: Garry
    │   └── skill/default-skill.md # Architecture & ADRs
    ├── project-manager/
    │   ├── role.md                # Persona: Sandy Cheeks
    │   └── skill/default-skill.md # File:line tasks, bug tracking, [DONE]-*
    ├── developer/
    │   ├── role.md                # Persona: Tn. Crab
    │   └── skill/default-skill.md # Clean implementation, anti-slop
    └── qa/
        ├── role.md                # Persona: Stanley
        └── skill/default-skill.md # Destructive testing & regression shield
```

---

## ⚡ Dual Operational Pipelines

### 1. New Feature Pipeline (Spec-Driven)
```text
Bos prompts idea ➔ Patrick (PRD) ➔ Squidward (UI/UX) ➔ Garry (Design) ➔ Sandy (Tasks) ➔ Tn. Crab (Code) ➔ Stanley (QA) ➔ Sandy renames to [DONE]-TASK-*.md
```

### 2. Urgent Bug Pipeline (Fast-Track)
```text
Bos reports bug ➔ Sandy creates BUG-*.md ➔ Garry & Tn. Crab apply surgical fix (Bypassing Master PRD!) ➔ Stanley verifies ➔ Sandy renames to [DONE]-BUG-*.md
```

---

## 💡 Key Design Highlights

- **Token Optimization**: Completed tasks are prefixed with `[DONE]-*`. The AI automatically skips reading them during active scans.
- **Precision Targeting**: Sandy enforces file paths and line ranges (`file.ts:L20-L45`) for all task items.
- **Brownfield Safety**: Strict no-refactor policy on existing codebases.
- **Language Protocol**: Conversational chat in room can be in Indonesian (calling user "Bos"), while all generated files and markdown blocks are **100% English**.

---

## 🛠️ Development

```bash
# Install dependencies
npm install

# Compile TypeScript
npm run build

# Run locally in development
npm run dev
```

## 📄 License
MIT © [Ivan Nofick](https://github.com/ivannofick)
