# employee-agents Hands-On Tutorial

A comprehensive, step-by-step tutorial on how to install, configure, and ship software features using your virtual 7-role engineering squad inside your AI coding assistant.

---

## Table of Contents

1. [Prerequisites & System Requirements](#prerequisites--system-requirements)
2. [Step 1: Initializing Your Workspace](#step-1-initializing-your-workspace)
3. [Step 2: Verifying the Generated Squad Files](#step-2-verifying-the-generated-squad-files)
4. [Step 3: Shipping Your First Feature (End-to-End Walkthrough)](#step-3-shipping-your-first-feature-end-to-end-walkthrough)
   - [Phase 1: Planning & Specification with /share-knowledge](#phase-1-planning--specification-with-share-knowledge)
   - [Phase 2: Inspecting the Kanban Dashboard with /my-task](#phase-2-inspecting-the-kanban-dashboard-with-my-task)
   - [Phase 3: Code Implementation & QA Verification with /apply-work](#phase-3-code-implementation--qa-verification-with-apply-work)
   - [Phase 4: Founder Review & Sign-Off with /done-task](#phase-4-founder-review--sign-off-with-done-task)
5. [Step 4: Handling Urgent Bugfixes (Fast-Track Flow)](#step-4-handling-urgent-bugfixes-fast-track-flow)
6. [Step 5: Leveling Up Roles with Modular Skills](#step-5-leveling-up-roles-with-modular-skills)
7. [Step 6: Keeping Your Workspace Clean (Hide & Show)](#step-6-keeping-your-workspace-clean-hide--show)
8. [Summary & Next Steps](#summary--next-steps)

---

## Prerequisites & System Requirements

Before running `employee-agents`, ensure your environment meets the following requirements. Direct download links and installation options are provided below:

### 1. Node.js Runtime (v20.0.0 or higher required)
`employee-agents` is an ES Module CLI that requires Node.js version 20 or later.

- **Direct Download**: [Download Node.js LTS (Official Website)](https://nodejs.org/en/download) (Select the LTS installer for macOS, Windows, or Linux).
- **Via Package Managers**:
  - macOS (Homebrew):
    ```bash
    brew install node
    ```
  - macOS / Linux (via nvm):
    ```bash
    nvm install 20 && nvm use 20
    ```
  - Windows (via winget):
    ```powershell
    winget install OpenJS.NodeJS.LTS
    ```
- **Verify Installation**:
  ```bash
  node -v   # Output must be v20.0.0 or higher (e.g. v20.18.0, v22.x)
  npm -v    # Output must be v9.0.0 or higher (bundled with Node.js)
  ```

---

### 2. Version Control (Git)
Git is required to manage source code history and track task tickets.

- **Direct Download**: [Download Git (Official Website)](https://git-scm.com/downloads)
- **Via Package Managers**:
  - macOS: `brew install git` or via Xcode Command Line Tools (`xcode-select --install`)
  - Ubuntu / Debian Linux: `sudo apt update && sudo apt install git`
  - Fedora Linux: `sudo dnf install git`
  - Windows: `winget install Git.Git`
- **Verify Installation**:
  ```bash
  git --version
  ```

---

### 3. AI Coding Assistant Environment
`employee-agents` integrates directly with AI agent environments:

- **Google Antigravity**: Use the Antigravity IDE or the Antigravity CLI (`agy`) with an active Google Gemini AI model (e.g., Gemini 1.5 Pro or Flash).
- *(Support for Cursor, Claude Code, Cline, and Windsurf is scheduled in our Roadmap)*.

---

### 4. Operating System & Terminal
- **macOS**: Terminal or iTerm2 running `zsh` or `bash`.
- **Linux**: Any standard shell (`bash`, `zsh`).
- **Windows**: Windows 10/11 running WSL2 (Ubuntu recommended) or PowerShell / Windows Terminal.

---

## Step 1: Initializing Your Workspace

Open your terminal, navigate to the root directory of your project (either a brand new directory or an existing codebase), and run:

```bash
# English setup wizard
npx employee-agents

# Or Indonesian setup wizard
npx employee-agents --lang id
```

The interactive CLI wizard will ask three quick questions:

1. **Project Type**:
   - `Greenfield (New Project)`: If you are starting a fresh project from scratch.
   - `Existing (Brownfield Codebase)`: If you are adding the squad to an existing repository. *(The CLI never touches, alters, or overwrites your existing application code)*.

2. **Platform Adapter**:
   - Select `Antigravity` (press Enter).

3. **Active Squad Roles**:
   - All 7 roles are selected by default (`tech-analyst`, `product-owner`, `ui-ux`, `tech-lead`, `project-manager`, `developer`, `qa`). Press Enter to accept the full squad.

Within 5 seconds, your virtual engineering team is scaffolded into your repository.

---

## Step 2: Verifying the Generated Squad Files

Once initialization completes, inspect your project directory. You will see two key components:

1. **`/.myemployee/` Directory (Isolated Squad Brain)**:
   - `PRD.md`: The Living Master PRD containing the high-level founder vision and an auto-updating feature index table.
   - `config.json`: Configuration storing project metadata and active squad roles.
   - `features/`: Directory where modular feature specifications (`PRD.md`, `DESIGN.md`, `ARCHITECTURE.md`) reside.
   - `tasks/`: Kanban task subdirectories:
     - `pending/`: Backlog tickets waiting for execution.
     - `in-progress/`: Active task ticket currently being coded.
     - `paused/`: Suspended tasks during priority pivots.
     - `done/`: Verified tasks signed off by the founder.
   - `roles/`: Persona definitions and lean default skills for each employee.

2. **Adapter & Universal Ambient Guardrail**:
   - `AGENTS.md` (at project root): A non-destructive, 1-sentence Single Source of Truth (SSOT) pointer that directs your AI coding assistant to `.agent/skills/myemployee/SKILL.md`.
   - `.agent/skills/myemployee/SKILL.md`: The master squad controller that orchestrates turn-taking, role boundaries, and anti-slop rules.
   - `.agent/workflows/`: Slash command workflows (`/share-knowledge`, `/apply-work`, `/done-task`, `/my-task`, `/add-skill`, `/update-me`, `/status-token`).

3. **Automatic Git Protection (`.gitignore`)**:
   - `employee-agents` automatically appends `/.myemployee/` (and `myemployee/`) to `.gitignore`. Even if you run `git add .` or commit your codebase, your internal squad tickets, PRDs, and employee configurations remain strictly local and are never pushed to remote git repositories.

---

## Step 3: Shipping Your First Feature (End-to-End Walkthrough)

In this practical scenario, we will build a real feature: **"User Profile Card Component"** with responsive avatar upload and stats display.

### Phase 1: Planning & Specification with `/share-knowledge`

Open your AI coding assistant chat room inside Antigravity and type:

```text
/share-knowledge Build a responsive User Profile Card component with avatar upload, follower counts, and bio edit
```

*(Alternatively, you can simply type a casual prompt like "Bikinin fitur User Profile Card dong" without slash commands; Larry and Patrick will automatically intercept it as front-desk triage)*.

#### What happens behind the scenes:
1. **Larry the Lobster (Technical Analyst)**: Evaluates technical feasibility, API data contracts, and payload boundaries.
2. **Patrick (Product Owner)**: Drafts `/.myemployee/features/user-profile-card/PRD.md` with Given-When-Then Acceptance Criteria, and syncs an executive summary row into `/.myemployee/PRD.md`.
3. **Squidward (UI/UX Designer)**: Drafts `/.myemployee/features/user-profile-card/DESIGN.md` defining Mobile-First design tokens (375px compact layout, typography, semantic color tokens) and Visual Acceptance Criteria (`[ ] VAC-01`).
4. **Garry (Tech Lead)**: Drafts `/.myemployee/features/user-profile-card/ARCHITECTURE.md` defining component breakdown, state management, and file targets with zero lasagna boilerplate.
5. **Sandy Cheeks (Project Manager)**: Generates the actionable task ticket in `/.myemployee/tasks/pending/TASK-<date>-user-profile-card.md` specifying exact target files and line ranges.

#### Result of Phase 1:
- Specs, tokens, and VAC checklists are committed to disk.
- **Zero application code has been written yet**, preventing hallucinated or slop code.

---

### Phase 2: Inspecting the Kanban Dashboard with `/my-task`

To inspect what tasks are queued for your squad, type in chat:

```text
/my-task
```

Sandy Cheeks (PM) will display your active Kanban board:
- **Active Task (In-Progress)**: None.
- **Prioritized Pending Tasks**: `TASK-<date>-user-profile-card.md` (Ready for execution).
- **Paused Tasks**: None.

You can open `/.myemployee/tasks/pending/TASK-<date>-user-profile-card.md` in your editor to inspect the exact checklist before starting execution.

---

### Phase 3: Code Implementation & QA Verification with `/apply-work`

When you are ready to implement the feature, type in chat:

```text
/apply-work user-profile-card
```

*(If you omit the slug, Sandy will pick the first prioritized ticket from `tasks/pending/` automatically)*.

#### What happens behind the scenes:
1. **Sandy Cheeks (PM)**: Moves the task ticket from `tasks/pending/` to `tasks/in-progress/`.
2. **Tn. Crab (Developer)**: Reads the target files specified in the ticket and surgically writes clean, token-adherent code. Tn. Crab tests the layout at 375px compact viewport to ensure zero horizontal scrollbars and verifies all interactive states.
3. **Stanley (QA Engineer)**: Executes destructive test scenarios (boundary values, null avatar, empty bio) and audits every Visual Acceptance Criteria item (`[ ] VAC-01`).

#### Critical Founder Sovereignty Rule:
Once implementation and verification are complete, **the task file stays in `tasks/in-progress/`**.
The AI squad is strictly forbidden from auto-marking the task `[DONE]` and will never nag you about `git push`. Execution stops here and hands control back to you.

---

### Phase 4: Founder Review & Sign-Off with `/done-task`

1. Review the generated code and test the component in your browser or local dev server.
2. When you are satisfied with the result, finalize the task in chat:

```text
/done-task user-profile-card
```

*(If you also want git push executed, add explicit permission in your prompt: `/done-task user-profile-card sekalian push ke git`)*.

#### What happens:
- Sandy Cheeks moves `TASK-<date>-user-profile-card.md` from `tasks/in-progress/` to `tasks/done/`.
- Sandy updates the feature status in `/.myemployee/PRD.md` to `DONE`.
- Archived tasks in `tasks/done/` are isolated and will never pollute your future AI context window.

Congratulations! You have shipped your first feature following strict spec-driven engineering discipline.

---

## Step 4: Handling Urgent Bugfixes (Fast-Track Flow)

When an urgent production bug occurs, you do not need to run a full `/share-knowledge` brainstorming session.

### How to trigger an urgent fix:
Prompt your AI assistant directly with an urgency cue:

```text
Langsung kerjakan sekarang: fix token expiry TypeError in src/middleware/auth.ts
```

#### What happens:
1. **Larry (Tech Analyst)**: Performs a 30-second technical triage in 3 bullet points.
2. **Patrick & Sandy**: Generate a 10-line Micro-PRD and task ticket directly in `tasks/pending/` with the `[BUG]` tag.
3. **Tn. Crab (Developer)**: Bypasses reading the Living Master PRD and immediately applies a surgical line edit to `src/middleware/auth.ts`.
4. **Stanley (QA)**: Validates the fix and checks for side-effects or regressions.
5. The task stays in `tasks/in-progress/` until you run `/done-task`.

---

## Step 5: Leveling Up Roles with Modular Skills

Each employee comes with a lean `default-skill.md` out of the box to preserve AI context capacity (< 0.6% of 1M tokens). You can add specialized skills on-demand as your project grows.

### Example: Giving Tn. Crab Docker Skills

#### Option A: Via Terminal CLI
```bash
# Interactive skill browser:
npx employee-agents add-skill

# Or direct installation:
npx employee-agents add-skill developer docker-containerization
```

#### Option B: Via Chat Room
Type in your AI chat:
```text
/add-skill
```
Garry and Sandy will present available skills from the registry and install the markdown skill file into `/.myemployee/roles/developer/skill/docker-containerization.md`.

---

## Step 6: Keeping Your Workspace Clean (Hide & Show)

If you prefer a clean IDE file tree without `/.myemployee` or `.vscode` cluttering your explorer sidebar, use the built-in visibility commands:

### Hide from Sidebar:
```bash
npx employee-agents hide
```
- Adds `files.exclude` rules in `.vscode/settings.json`.
- Both `/.myemployee` and `.vscode` are concealed from your IDE file explorer.
- **Your AI squad continues to read, write, and execute tasks in `/.myemployee/` seamlessly in the background.**

### Restore to Sidebar:
```bash
npx employee-agents show
```
- Restores `/.myemployee` to your sidebar explorer.
- If `.vscode/settings.json` has no other user settings, the CLI automatically deletes `settings.json` and removes the `.vscode/` directory, leaving **zero residue**.

---

## Summary & Next Steps

You now know how to:
- Initialize the squad in any new or existing repository (`npx employee-agents`).
- Plan and specify features before writing code (`/share-knowledge`).
- Track your task tickets cleanly on disk (`/my-task`).
- Surgically execute and verify features (`/apply-work`).
- Approve and archive tasks with founder sovereignty (`/done-task`).
- Resolve urgent bugs in fast-track mode.
- Install modular skills on-demand (`/add-skill`).
- Toggle workspace sidebar visibility (`hide` / `show`).

For deeper architectural topics:
- **Token Efficiency**: Read [TOKEN_FOOTPRINT.md](TOKEN_FOOTPRINT.md) for context window consumption benchmarks.
- **Squad Roster**: See [README.md](README.md) for detailed descriptions of all 7 personas.
- **Roadmap**: See [ROADMAP.md](ROADMAP.md) for upcoming platform adapters and features.
