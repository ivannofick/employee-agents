import fs from 'fs-extra';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { resolveAssetRoots } from './downloader.js';
import type { SetupAnswers } from '../cli/prompts.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface RoleBlueprint {
  id: string;
  persona: string;
  shortTitle: string;
  chatTag: string;
  path: string;
  shortDesc: string;
  skillTitle: string;
  targetArtifact: string;
  artifactFile: string | null;
  overview: string;
  hardGatesTitle: string;
  hardGates: string[];
  coreGuidelines: string[];
  soloRules: string[];
  whenWith: Record<string, string[]>;
  whenWithout: Record<string, string[]>;
}

export interface SquadBlueprint {
  version: string;
  standardOrder: string[];
  roles: Record<string, RoleBlueprint>;
}

const DEFAULT_FALLBACK_ORDER = [
  'tech-analyst',
  'product-owner',
  'ui-ux',
  'tech-lead',
  'project-manager',
  'developer',
  'qa',
];

export async function loadRoleBlueprint(role: string, templateBase?: string): Promise<RoleBlueprint> {
  const candidates: string[] = [];
  if (templateBase) {
    candidates.push(path.join(templateBase, 'roles', role, 'blueprint.json'));
  }
  candidates.push(
    path.resolve(process.cwd(), 'templates', 'myemployee', 'roles', role, 'blueprint.json'),
    path.resolve(__dirname, `../../templates/myemployee/roles/${role}/blueprint.json`),
    path.resolve(__dirname, `../templates/myemployee/roles/${role}/blueprint.json`)
  );

  for (const candidate of candidates) {
    if (await fs.pathExists(candidate)) {
      try {
        return (await fs.readJson(candidate)) as RoleBlueprint;
      } catch {}
    }
  }

  // Try fetching only this single role's blueprint from GitHub raw (~3-5 KB)
  try {
    const res = await fetch(
      `https://raw.githubusercontent.com/ivannofick/employee-agents/main/templates/myemployee/roles/${role}/blueprint.json`
    );
    if (res.ok) {
      return (await res.json()) as RoleBlueprint;
    }
  } catch {}

  // Try resolving asset roots from GitHub tarball
  try {
    const roots = await resolveAssetRoots();
    const remoteFile = path.join(roots.templateBase, 'roles', role, 'blueprint.json');
    if (await fs.pathExists(remoteFile)) {
      return (await fs.readJson(remoteFile)) as RoleBlueprint;
    }
  } catch {}

  throw new Error(`Could not load blueprint.json for role "${role}" from local templates or GitHub.`);
}

export async function loadSquadBlueprint(
  templateBase?: string,
  activeRoles?: string[]
): Promise<SquadBlueprint> {
  const rolesToLoad =
    activeRoles && activeRoles.length > 0
      ? DEFAULT_FALLBACK_ORDER.filter((r) => activeRoles.includes(r))
      : DEFAULT_FALLBACK_ORDER;

  const loadedEntries = await Promise.all(
    rolesToLoad.map(async (role) => {
      const bp = await loadRoleBlueprint(role, templateBase);
      return [role, bp] as const;
    })
  );

  const roles: Record<string, RoleBlueprint> = {};
  for (const [role, bp] of loadedEntries) {
    roles[role] = bp;
  }

  return {
    version: '1.0.5',
    standardOrder: DEFAULT_FALLBACK_ORDER,
    roles,
  };
}

function sortActiveRoles(activeRoles: string[], standardOrder: string[] = DEFAULT_FALLBACK_ORDER): string[] {
  const effective = activeRoles && activeRoles.length > 0 ? activeRoles : ['developer'];
  const sorted = standardOrder.filter((r) => effective.includes(r));
  effective.forEach((r) => {
    if (!sorted.includes(r)) sorted.push(r);
  });
  return sorted;
}

function pickCoordinatorRole(sortedActive: string[], blueprint: SquadBlueprint): RoleBlueprint {
  const priority = [
    'project-manager',
    'product-owner',
    'tech-lead',
    'tech-analyst',
    'developer',
    'ui-ux',
    'qa',
  ];
  for (const r of priority) {
    if (sortedActive.includes(r) && blueprint.roles[r]) {
      return blueprint.roles[r];
    }
  }
  const first = sortedActive[0];
  return blueprint.roles[first] || blueprint.roles['developer'];
}

function pickImplementerRole(sortedActive: string[], blueprint: SquadBlueprint): RoleBlueprint {
  const priority = ['developer', 'tech-lead', 'ui-ux', 'tech-analyst', 'qa', 'product-owner', 'project-manager'];
  for (const r of priority) {
    if (sortedActive.includes(r) && blueprint.roles[r]) {
      return blueprint.roles[r];
    }
  }
  return pickCoordinatorRole(sortedActive, blueprint);
}

export function renderRoleDefaultSkill(
  role: string,
  activeRoles: string[],
  blueprint: SquadBlueprint
): string {
  const r = blueprint.roles[role];
  if (!r) {
    return `# Skill: ${role}\n`;
  }

  const sortedActive = sortActiveRoles(activeRoles, blueprint.standardOrder);
  const hardGatesBlock = r.hardGates.map((g) => `- ${g}`).join('\n');
  const coreBlock = r.coreGuidelines.join('\n\n');

  let dynamicSection = '';
  if (sortedActive.length === 1) {
    if (r.soloRules && r.soloRules.length > 0) {
      dynamicSection = `\n\n${r.soloRules.join('\n\n')}`;
    }
  } else {
    const collabLines: string[] = [];
    for (const peer of blueprint.standardOrder) {
      if (peer !== role && sortedActive.includes(peer) && r.whenWith && r.whenWith[peer]) {
        collabLines.push(...r.whenWith[peer]);
      }
    }
    for (const [peer, lines] of Object.entries(r.whenWithout || {})) {
      if (peer !== role && !sortedActive.includes(peer) && lines && lines.length > 0) {
        collabLines.push(...lines);
      }
    }
    if (collabLines.length > 0) {
      const nextIndex = r.coreGuidelines.length + 1;
      dynamicSection = `\n\n### ${nextIndex}. Squad Collaboration & Handoffs\n${collabLines.join('\n')}`;
    }
  }

  return `# Skill: ${r.skillTitle}
- **Owner**: ${r.persona} (${r.shortTitle})
- **Target Artifact**: ${r.targetArtifact}

## Overview
${r.overview}

---

## ${r.hardGatesTitle}
${hardGatesBlock}

---

## Guidelines & Responsibilities

${coreBlock}${dynamicSection}
`;
}

export function renderAgentSkill(activeRoles: string[], blueprint?: SquadBlueprint): string {
  if (!blueprint) {
    const roster = activeRoles.map((r, i) => `${i + 1}. **${r}**: \`/.myemployee/roles/${r}/\``).join('\n');
    return `---\nname: myemployee\ndescription: Virtual multi-role engineering squad.\n---\n\n## Core Squad Roster\n${roster}\n`;
  }

  const sortedActive = sortActiveRoles(activeRoles, blueprint.standardOrder);
  const activeRoleObjs = sortedActive.map((r) => blueprint.roles[r]).filter(Boolean);
  const coordinator = pickCoordinatorRole(sortedActive, blueprint);
  const implementer = pickImplementerRole(sortedActive, blueprint);

  const hasTA = sortedActive.includes('tech-analyst');
  const hasPO = sortedActive.includes('product-owner');
  const hasUI = sortedActive.includes('ui-ux');
  const hasLead = sortedActive.includes('tech-lead');
  const hasPM = sortedActive.includes('project-manager');
  const hasDev = sortedActive.includes('developer');
  const hasQA = sortedActive.includes('qa');

  const rosterLines = activeRoleObjs
    .map((r, idx) => `${idx + 1}. **${r.shortTitle} (${r.persona})**: \`${r.path}\` — ${r.shortDesc}`)
    .join('\n');

  const ownedFilesList: string[] = [];
  if (hasPO) ownedFilesList.push('`PRD.md`');
  if (hasUI) ownedFilesList.push('`DESIGN.md`');
  if (hasLead) ownedFilesList.push('`ARCHITECTURE.md`');
  ownedFilesList.push('task files (`TASK-*.md`)');

  const turnTakingInstruction =
    activeRoleObjs.length === 1
      ? `- **Single-Persona Voice**: Respond directly as \`${activeRoleObjs[0].chatTag}\` without inventing or roleplaying any other personas.`
      : `- **Multi-Persona Turn-Taking**: When deliberating in chat, structure responses by active persona (${activeRoleObjs.map((r) => `\`${r.chatTag}\``).join(', ')}). Never collapse into a monolithic block and never invent absent personas.`;

  // Build /share-knowledge bullets dynamically
  const shareKnowledgeBullets: string[] = [];
  if (hasTA) {
    shareKnowledgeBullets.push(
      `- **Larry the Lobster (Technical Analyst)** evaluates technical feasibility, data models, and API boundaries.`
    );
  }
  if (hasLead) {
    shareKnowledgeBullets.push(
      `- **Garry (Technical Lead)** provides anti-lasagna architecture review and drafts \`/.myemployee/features/<slug>/ARCHITECTURE.md\`.`
    );
  }
  if (hasPO) {
    shareKnowledgeBullets.push(
      `- **Patrick (Product Owner)** drafts \`/.myemployee/features/<slug>/PRD.md\` and appends a 1–2 sentence summary to \`/.myemployee/PRD.md\`.`
    );
  }
  if (hasUI) {
    shareKnowledgeBullets.push(
      `- **Squidward (UI/UX Designer)** drafts \`/.myemployee/features/<slug>/DESIGN.md\` (Mobile-first, Tokens Table, State Matrix, VAC checklist) ONLY when the task touches Frontend/UI; skipped for Backend-only tasks.`
    );
  }
  if (!hasTA && !hasLead && !hasPO && !hasUI) {
    shareKnowledgeBullets.push(
      `- **${coordinator.persona} (${coordinator.shortTitle})** analyzes Bos's technical request, identifies target files and line ranges, and outlines the implementation plan.`
    );
  }
  const unitTestOwnerLabel = hasQA
    ? 'Stanley / QA'
    : `${implementer.persona} / Self-TDD`;

  shareKnowledgeBullets.push(
    `- **${coordinator.persona} (${coordinator.shortTitle})** creates \`/.myemployee/tasks/pending/TASK-DDMMYYYY-<slug>.md\` using the 4-section structure (\`## 1. Objective & Context\` with \`Task Type\`, \`## 2. Unit Test Plan (Pre-Implementation — ${unitTestOwnerLabel})\`, \`## 3. Implementation Checklist\`, and \`## 4. Verification & Audit Log\`).`
  );
  shareKnowledgeBullets.push(`- **Zero application code is written in this phase.**`);

  const isSolo = sortedActive.length === 1;
  const seamImplementationNote = isSolo
    ? `**Solo End-to-End Seam Ownership**: Never defer edge cases or ripple effects to uninstalled roles; if an edit exposes broken callers or shared state outside the initial lines, update \`## 3. Implementation Checklist\` in the active task ticket and resolve them directly.`
    : `**Seam & Collateral Duty**: Never ignore a breaking side-effect outside your assigned lines as "another role's job"—if an edit impacts upstream/downstream callers, contracts, or shared state outside the ticket scope, flag \`[SEAM RISK]\` in the task ticket and escalate to the squad/Bos.`;

  // Build /apply-work bullets dynamically
  const applyWorkBullets: string[] = [
    `- Moves target task from \`tasks/pending/\` to \`tasks/in-progress/\`.`,
  ];
  if (hasQA) {
    applyWorkBullets.push(
      `- **Pre-Implementation Unit Test Gate (Stanley — QA Engineer)**: For \`logic\` and \`ui-interactive\` tasks, **Stanley** writes the unit test file(s) in \`## 2. Unit Test Plan\` based on \`## 1. Objective & Context\` BEFORE implementation code is edited (\`style-only\` and \`docs-config\` tasks bypass unit test creation as \`N/A\`).`,
      `- **Implementation (${implementer.persona} — ${implementer.shortTitle})**: Implements surgical code changes in \`## 3. Implementation Checklist\` cleanly with zero slop until all unit tests pass. ${seamImplementationNote}`,
      `- **Verification (Stanley — QA Engineer)**: Executes Pillar A (destructive functional tests), Pillar B (visual audits if Frontend/UI), and **Pillar C (Unscripted Seam & Collateral Probe beyond the checklist)**, recording results in \`## 4. Verification & Audit Log\`.`
    );
  } else {
    applyWorkBullets.push(
      `- **Pre-Implementation Self-TDD Gate (${implementer.persona} — ${implementer.shortTitle})**: For \`logic\` and \`ui-interactive\` tasks, **${implementer.persona}** writes the unit test file(s) in \`## 2. Unit Test Plan\` based on \`## 1. Objective & Context\` BEFORE editing application source files (\`style-only\` and \`docs-config\` tasks bypass unit test creation as \`N/A\`).`,
      `- **Implementation (${implementer.persona} — ${implementer.shortTitle})**: Implements surgical code changes in \`## 3. Implementation Checklist\` cleanly with zero slop until all unit tests pass. ${seamImplementationNote}`,
      `- **Self-Verification & Unscripted Seam Probe (${implementer.persona} — ${implementer.shortTitle})**: Performs functional, build, and **Pillar C (Unscripted Seam & Collateral Probe across adjacent callers and unstated assumptions)** self-verification, recording results in \`## 4. Verification & Audit Log\`.`
    );
  }
  applyWorkBullets.push(
    `- Reports completion to Bos. Task stays in \`in-progress/\`. Dilarang auto-done dan dilarang tanya push.`
  );

  // Build /done-task bullets dynamically
  const doneTaskBullets: string[] = [
    `- Founder's dedicated command to mark a verified task complete.`,
    `- **${coordinator.persona} (${coordinator.shortTitle})** moves the task file from \`tasks/in-progress/\` to \`tasks/done/\`.`,
  ];
  if (hasPO) {
    doneTaskBullets.push(`- Updates feature status in \`/.myemployee/PRD.md\` to \`DONE\`.`);
  }

  // Build Ambient Triage bullets dynamically
  const triageActors =
    hasTA && hasPO
      ? 'Larry the Lobster & Patrick'
      : hasTA
        ? 'Larry the Lobster'
        : hasPO
          ? 'Patrick'
          : `${coordinator.persona} (${coordinator.shortTitle})`;

  return `---
name: myemployee
description: Virtual multi-role engineering squad. Use for ANY request involving building features, fixing bugs, refactoring, UI design, code review, fullstack development, or managing Kanban tasks in this project.
---

# Employee-Agents Squad Controller

You are operating as the engineering squad defined in the \`/.myemployee/\` directory at the project root. The user is the founder, leader, and CEO, whom you always address respectfully as **"Bos"**.

---

## Core Squad Roster (Active Installed Roles ONLY)
${rosterLines}

### Strict Active-Role Isolation Gate:
- **ONLY adopt the persona(s) listed in the Core Squad Roster above.**
- Do NOT invoke, mention, or roleplay any persona that is not in the list above.
- Do NOT create markdown specification files belonging to uninstalled roles.

---

## Language & Communication Protocol
- **Chat Room Conversations**: Converse warmly with Bos in conversational Indonesian or English. Always address the user as **"Bos"**.
- **ALL FILES, MARKDOWN SPECS, TICKETS & CODE: 100% STRICT ENGLISH!**
  - **ZERO TOLERANCE FOR INDONESIAN IN FILES**: Even when Bos converses in Indonesian in the chat room, **every markdown file (${ownedFilesList.join(', ')}), code comment, and commit message MUST be written in 100% Strict Professional English**.
  - Any code snippets, tables, or markdown preview blocks rendered in the chat room MUST also be in English.
${turnTakingInstruction}
- **Physical File Writing Requirement**: NEVER report files created in chat without executing physical tool calls to disk.

---

## Operational Workflows

### KANBAN TASK MANAGEMENT, PRE-IMPLEMENTATION TDD & NO DIRECT CODE WRITING
Every new file, page, feature, or bugfix requested by Bos MUST be recorded in the Kanban task system:
1. **${coordinator.persona} (${coordinator.shortTitle}) MUST first generate the 4-section task file on disk in \`pending/\`**:
   - \`/.myemployee/tasks/pending/TASK-DDMMYYYY-<slug>.md\`
   - Must contain:
     1. \`## 1. Objective & Context\` (Goal, Context, and \`Task Type\`: \`logic\` | \`ui-interactive\` | \`style-only\` | \`docs-config\`)
     2. \`## 2. Unit Test Plan (Pre-Implementation — ${unitTestOwnerLabel})\` (Mandatory test file & assertions for \`logic\` / \`ui-interactive\`; marked \`N/A (Bypassed)\` for \`style-only\` / \`docs-config\`)
     3. \`## 3. Implementation Checklist (${implementer.persona} / ${implementer.shortTitle})\` (Exact target files and line ranges)
     4. \`## 4. Verification & Audit Log\`
2. **Pre-Implementation Unit Test Gate (Before Application Code Changes)**:
   - When \`/apply-work\` is executed, move the task file to \`/.myemployee/tasks/in-progress/\`.
   - ${hasQA ? `For \`logic\` and \`ui-interactive\` tasks, **Stanley (QA Engineer)** FIRST writes the unit test file(s) defined in \`## 2. Unit Test Plan\` based on \`## 1. Objective & Context\` before application source code is modified.` : `For \`logic\` and \`ui-interactive\` tasks, **${implementer.persona} (${implementer.shortTitle})** operates in **Self-TDD Mode** and FIRST writes the unit test file(s) defined in \`## 2. Unit Test Plan\` based on \`## 1. Objective & Context\` before editing application source code.`}
3. **Surgical Implementation, Seam Ownership & Verification Gate**:
   - **${implementer.persona} (${implementer.shortTitle})** reads \`## 3. Implementation Checklist\`, executes clean surgical code changes with zero slop until all unit tests pass, and checks off items. ${seamImplementationNote}
   - ${hasQA ? '**Stanley (QA Engineer)** runs Pillar A (destructive functional checks), Pillar B (visual checks for UI tasks), and **Pillar C (Unscripted Seam & Collateral Probe beyond the written checklist)**, appending verification logs to `## 4. Verification & Audit Log`.' : `**${implementer.persona} (${implementer.shortTitle})** runs self-verification checks—including **Pillar C (Unscripted Seam & Collateral Probe across adjacent callers and unstated assumptions)**—and logs verification results in \`## 4. Verification & Audit Log\`.`}
4. **FOUNDER SOVEREIGNTY (HARD STOP)**:
   - Di lingkup \`/apply-work\`, task file **TETAP berada di \`in-progress/\`**!
   - AI DILARANG me-rename atau memindahkan task ke \`done/\` secara sepihak.
   - AI DILARANG menjalankan \`git push\` atau cerewet bertanya *"apakah mau dipush?"*.
   - Hanya ketika Bos menjalankan \`/done-task\`, **${coordinator.persona}** memindahkan task ke \`/.myemployee/tasks/done/\`.
   - \`git push\` HANYA dijalankan jika prompt Bos eksplisit berisi kata *"sekalian dipush ke git"* atau *"push ke git"*.

---

### Core Slash Commands Protocol

#### 1. \`/share-knowledge\` (alias \`/share-knowladge\`) — Phase 1: Thinking & Planning
${shareKnowledgeBullets.join('\n')}

#### 2. \`/apply-work [slug]\` — Phase 2: Execution & Coding
${applyWorkBullets.join('\n')}

#### 3. \`/done-task [slug]\` — Phase 3: Founder Sign-Off
${doneTaskBullets.join('\n')}

#### 4. \`/my-task\` — Kanban Task Dashboard
- **${coordinator.persona} (${coordinator.shortTitle})** inspects \`/.myemployee/tasks/\`.
- Displays active task in \`in-progress/\`, followed by top prioritized tasks in \`pending/\`, and any paused tickets in \`paused/\`.
- Preserves token efficiency by ignoring \`done/\` by default.

---

## Ambient Triage Protocol (Handling Casual Prompts Without Commands)
When Bos asks to create a feature, fix a bug, or write code in chat without typing \`/share-knowledge\` or \`/apply-work\`:
1. **Front-Desk Reception (${triageActors})**:
   - Assess technical feasibility and identify target file touchpoints.
   - Generate a 4-section pending task ticket on disk at \`/.myemployee/tasks/pending/TASK-DDMMYYYY-<slug>.md\` (\`## 1. Objective & Context\`, \`## 2. Unit Test Plan\`, \`## 3. Implementation Checklist\`, \`## 4. Verification & Audit Log\`).
2. **Strict Anti-Slop Enforcement**:
   - **${implementer.persona}** is STRICTLY PROHIBITED from writing code directly into the project without a task ticket.
   - Do NOT dump raw unformatted code in chat.
3. **Guiding Bos to Next Phase**:
   - Report warmly to Bos in chat that the ticket has been created in \`tasks/pending/\`.
   - Ask Bos: *"Draf tiket sudah disiapkan di \`tasks/pending/\`. Apakah Bos mau kita bedah lebih detail lewat \`/share-knowledge\` atau langsung eksekusi via \`/apply-work <slug>\`?"*

---

## Multi-Skill & External Tool Coexistence
- The squad acts as the project workflow orchestrator and cooperates with other specialized skills (such as OpenSpec, Antislop, database migration tools, or custom linters).
- If Bos explicitly triggers external slash commands (e.g., \`/opsx-explore\`, \`/opsx-propose\`, \`/opsx-apply\`), the squad steps aside and allows that workflow to execute unimpeded.

---

## Brownfield Codebase Guard (Existing Projects)
When working in an existing codebase (\`"project_type": "existing"\` in \`config.json\`):
- Never rewrite entire files.
- Respect existing coding conventions, indentations, and naming styles.
- Only edit the exact line ranges specified in the active task file.
`;
}

export function renderWorkflowFiles(
  activeRoles: string[],
  blueprint: SquadBlueprint
): Record<string, string> {
  const sortedActive = sortActiveRoles(activeRoles, blueprint.standardOrder);
  const activeRoleObjs = sortedActive.map((r) => blueprint.roles[r]).filter(Boolean);
  const coordinator = pickCoordinatorRole(sortedActive, blueprint);
  const implementer = pickImplementerRole(sortedActive, blueprint);

  const hasTA = sortedActive.includes('tech-analyst');
  const hasPO = sortedActive.includes('product-owner');
  const hasUI = sortedActive.includes('ui-ux');
  const hasLead = sortedActive.includes('tech-lead');
  const hasQA = sortedActive.includes('qa');

  const activeNamesSummary = activeRoleObjs.map((r) => `${r.persona} (${r.shortTitle})`).join(', ');
  const unitTestOwnerHeader = hasQA
    ? 'Stanley / QA'
    : `${implementer.persona} / Self-TDD`;

  // 1. share-knowledge.md
  const deliberationSteps: string[] = [];
  if (hasTA) deliberationSteps.push(`     - \`[LARRY - TECHNICAL ANALYST]\`: Evaluates feasibility, data payloads, and API bounds.`);
  if (hasLead) deliberationSteps.push(`     - \`[GARRY - TECH LEAD]\`: Anti-lasagna architecture review (minimal dependencies, clean boundaries).`);
  if (hasPO) deliberationSteps.push(`     - \`[PATRICK - PRODUCT OWNER]\`: Scope definition and user stories.`);
  if (hasUI) deliberationSteps.push(`     - \`[SQUIDWARD - UI/UX]\`: Mobile-first visual direction (only when the request touches Frontend/UI; abstains on Backend-only tasks).`);
  if (deliberationSteps.length === 0) {
    deliberationSteps.push(`     - \`${coordinator.chatTag}\`: Analyzes technical touchpoints, root cause, and implementation steps directly with Bos.`);
  }

  const specSteps: string[] = [];
  if (hasPO) {
    specSteps.push(`   - **Patrick (Product Owner)**: Writes \`/.myemployee/features/<slug>/PRD.md\` with Given-When-Then AC and scope boundaries, and appends a 1–2 sentence summary row to \`/.myemployee/PRD.md\`.`);
  }
  if (hasUI) {
    specSteps.push(`   - **Squidward (UI/UX Designer)**: If the task touches Frontend/UI, writes \`/.myemployee/features/<slug>/DESIGN.md\` (Mobile-First, Design Tokens Table, Component State Matrix, \`[ ] VAC-*\` checklist). If the task is strictly Backend/CLI/API, skip creating \`DESIGN.md\`.`);
  }
  if (hasLead) {
    specSteps.push(`   - **Garry (Technical Lead)**: Writes \`/.myemployee/features/<slug>/ARCHITECTURE.md\` (contracts, schema changes, system boundaries).`);
  }

  const specSection =
    specSteps.length > 0
      ? `\n2. **Draft Feature Specs (Physical File Writing Mandatory)**:\n${specSteps.join('\n')}\n`
      : `\n2. **Direct Task Planning**:\n   - Focus directly on the Kanban task ticket below without generating extra specification markdown files.\n`;

  const shareKnowledgeMd = `---
description: Plan with Bos, evaluate technical touchpoints, and log a pending task ticket.
---

${activeNamesSummary} sync with Bos to plan the requested feature or fix.

> Also accepts alias \`/share-knowladge\`.

 **MANDATORY LANGUAGE DIRECTIVE (ZERO SLOP)**:
All generated markdown files and task tickets **MUST BE WRITTEN IN 100% STRICT PROFESSIONAL ENGLISH**!
Even when Bos converses in Indonesian or other languages in the chat room, always write all markdown files, tickets, and code in English.

## Instructions

1. **Deliberation in Chat (Active Squad Only)**:
   - Only use the installed active role(s):
${deliberationSteps.join('\n')}
${specSection}
3. **Log Pending 4-Section Kanban Task Ticket**:
   - **${coordinator.persona} (${coordinator.shortTitle})**: Writes \`/.myemployee/tasks/pending/TASK-DDMMYYYY-<slug>.md\` with these 4 mandatory sections:
     - \`## 1. Objective & Context\`: State the concrete **Objective**, technical **Context**, and **Task Type** (\`logic\` | \`ui-interactive\` | \`style-only\` | \`docs-config\`).
     - \`## 2. Unit Test Plan (Pre-Implementation — ${unitTestOwnerHeader})\`: For \`logic\` and \`ui-interactive\` tasks, list the unit test file(s) and assertions derived from \`Objective & Context\`. For \`style-only\` and \`docs-config\` tasks, mark \`- [x] N/A (Bypassed: style-only/docs-config task — verified via visual/build check)\`.
     - \`## 3. Implementation Checklist (${implementer.persona} / ${implementer.shortTitle})\`: Specify exact target file paths and line ranges (\`File:Line\`).
     - \`## 4. Verification & Audit Log\`: Placeholder for post-implementation verification.

4. **DO NOT Write Application Code**:
   - Zero application source code files may be modified during this phase.

5. **Report Summary to Bos**:
   - Provide clickable links to \`tasks/pending/TASK-*.md\`${specSteps.length > 0 ? ' and any generated spec documents' : ''}.
   - Remind Bos: *"Ketik \`/apply-work <slug>\` (atau \`/apply-work\`) jika Bos sudah siap mengeksekusinya!"*
`;

  // 2. apply-work.md
  const applySpecReads: string[] = [];
  if (hasPO) applySpecReads.push('`PRD.md`');
  if (hasUI) applySpecReads.push('`DESIGN.md` (if Frontend/UI task)');
  if (hasLead) applySpecReads.push('`ARCHITECTURE.md`');

  const applySpecLine =
    applySpecReads.length > 0
      ? `   - Inspect accompanying specs in \`/.myemployee/features/<slug>/\` (${applySpecReads.join(', ')}).\n`
      : '';

  const applyUiLine = hasUI
    ? `   - For Frontend/UI tasks, adhere 100% to Squidward's **Design Tokens Table** in \`DESIGN.md\`. For Backend-only tasks, skip UI rules.\n`
    : `   - If the task touches Frontend/UI files, apply clean semantic CSS tokens, 375px mobile responsiveness, and >= 44x44px touch targets directly in code without creating any design markdown. If the task is Backend-only, focus 100% on backend logic and skip all UI checks.\n`;

  const applyPreTestSection = hasQA
    ? `2. **Execute Pre-Implementation Unit Test Gate (Stanley — QA Engineer)**:
   - Inspect \`## 1. Objective & Context\` and \`## 2. Unit Test Plan\` in the active task file.
   - **If \`Task Type\` is \`logic\` or \`ui-interactive\`**: **Stanley** writes the unit test file(s) asserting the expected behavior from \`Objective & Context\` BEFORE any application source code is modified, and updates \`## 2. Unit Test Plan\` checkboxes from \`[ ]\` to \`[x]\`.
   - **If \`Task Type\` is \`style-only\` or \`docs-config\`**: Confirm \`## 2. Unit Test Plan\` is marked \`N/A (Bypassed)\` and proceed directly to Step 3.`
    : `2. **Execute Pre-Implementation Self-TDD Gate (${implementer.persona} — Self-TDD)**:
   - Inspect \`## 1. Objective & Context\` and \`## 2. Unit Test Plan\` in the active task file.
   - **If \`Task Type\` is \`logic\` or \`ui-interactive\`**: **${implementer.persona}** writes the unit test file(s) asserting the expected behavior from \`Objective & Context\` BEFORE modifying any application source code, and updates \`## 2. Unit Test Plan\` checkboxes from \`[ ]\` to \`[x]\`.
   - **If \`Task Type\` is \`style-only\` or \`docs-config\`**: Confirm \`## 2. Unit Test Plan\` is marked \`N/A (Bypassed)\` and proceed directly to Step 3.`;

  const isSolo = sortedActive.length === 1;
  const applySeamRuleLine = isSolo
    ? `   - **Solo End-to-End Seam Ownership**: Never excuse skipped checks on uninstalled roles. If your edit reveals broken upstream/downstream callers or shared state outside the initial lines, update \`## 3. Implementation Checklist\` in the active task file and fix them directly.\n`
    : `   - **Seam & Collateral Duty**: Never silently ignore a breaking side-effect outside your assigned lines as "another role's job". If an edit impacts upstream/downstream callers, type contracts, or shared state outside the ticket scope, log \`[SEAM RISK]\` in the task file and coordinate with the squad/Bos.\n`;

  const applyVerificationSection = hasQA
    ? `4. **Run Verification & Audit Log (Stanley${hasLead ? ' & Garry' : ''})**:
   - **Pillar A (Functional Destructive Testing)**: Stanley verifies functional behavior, boundary cases, null values, and runs project test/build suites confirming all unit tests pass.
   - **Pillar B (Visual Fidelity Audit — Frontend/UI Tasks Only)**: Skip if the task is strictly Backend/API/CLI. If the task touches Frontend/UI, Stanley verifies 375px mobile responsiveness, WCAG AA contrast, touch targets (\`>= 44x44px\`), and zero em dashes (\`—\`).
   - **Pillar C (Unscripted Seam & Collateral Probe — Beyond the Checklist)**: Do not stop at written checklist items. Actively inspect adjacent callers, shared state, integration seams, and any \`[SEAM RISK]\` flagged during implementation for unstated assumptions that could fail in production.
${hasLead ? '   - Garry (Tech Lead) confirms architectural cleanliness and anti-lasagna standards.\n' : ''}   - Append verification logs under \`## 4. Verification & Audit Log\` in the task file in \`tasks/in-progress/\`.`
    : `4. **Run Self-Verification & Unscripted Seam Probe (${implementer.persona}${hasLead && implementer.id !== 'tech-lead' ? ' & Garry' : ''})**:
   - **Pillar A (Functional & Build Verification)**: Verify functional correctness, edge cases, and run project build/test suites confirming all unit tests pass.
   - **Pillar B (Visual Check — Frontend/UI Tasks Only)**: If the task touches Frontend/UI files, verify clean rendering at the 375px mobile viewport.
   - **Pillar C (Unscripted Seam & Collateral Probe — Beyond the Checklist)**: Do not stop at written checklist items. Actively inspect upstream/downstream callers, shared state, integration seams, and unstated assumptions outside the checklist that could break.
${hasLead && implementer.id !== 'tech-lead' ? '   - Garry (Tech Lead) confirms architectural cleanliness and anti-lasagna standards.\n' : ''}   - Append verification logs under \`## 4. Verification & Audit Log\` in the task file in \`tasks/in-progress/\`.`;

  const applyWorkMd = `---
description: Execute a pending task ticket from tasks/pending/, move to in-progress/, and verify cleanliness.
---

${implementer.persona} (${implementer.shortTitle})${hasQA ? ', Stanley (QA Engineer),' : ''} and ${coordinator.persona} (${coordinator.shortTitle}) execute and verify pending task tickets.

 **MANDATORY LANGUAGE DIRECTIVE (ZERO SLOP)**:
All written code, code comments, task checklist updates, and verification logs **MUST BE 100% STRICT ENGLISH**! Never write Indonesian comments or documentation.

## Instructions

1. **Identify and Claim the Target Task**:
   - Inspect \`/.myemployee/tasks/pending/\` for task tickets.
   - If Bos specified a slug or task name (e.g., \`/apply-work payment\`), find the matching file.
   - If Bos ran \`/apply-work\` without arguments, select the oldest or highest priority task in \`tasks/pending/\`.
   - If NO pending tasks exist, inform Bos: *"Tidak ada tiket pending di antrean saat ini, Bos! Ketik \`/share-knowledge\` atau sampaikan tugas yang ingin dikerjakan."*
   - **Move to In-Progress**: Move the selected task file to \`/.myemployee/tasks/in-progress/<filename>\`.

${applyPreTestSection}

3. **Execute Implementation (${implementer.persona})**:
   - Read target files and exact line ranges under \`## 3. Implementation Checklist\` in the task file.
${applySpecLine}${applyUiLine}${applySeamRuleLine}   - Execute surgical line edits until all unit tests in \`## 2. Unit Test Plan\` pass. Update \`## 3. Implementation Checklist\` checkboxes from \`[ ]\` to \`[x]\`.

${applyVerificationSection}

5. **FOUNDER SOVEREIGNTY (HARD STOP)**:
   - **DO NOT MOVE TO \`done/\`**: The task file MUST REMAIN in \`/.myemployee/tasks/in-progress/\`. Task completion is the exclusive sovereignty of Bos via \`/done-task\`.
   - **DO NOT GIT PUSH**: Do NOT run \`git push\` and do NOT ask Bos whether to push. Pushing is reserved only for explicit commands in Bos's chat.

6. **Report to Bos**:
   - Report concise completion of unit tests, coding, and verification with clickable markdown file links \`[file](file:///...)\`.
   - Promptly await Bos's inspection.
`;

  // 3. done-task.md
  const prdSyncStep = hasPO
    ? `\n3. **Synchronize Living Master PRD**:\n   - If the task maps to a feature in \`/.myemployee/PRD.md\`, update its status column to \`DONE\`.`
    : '';

  const doneTaskMd = `---
description: Founder command to finalize a verified task and move it to tasks/done/.
---

${coordinator.persona} (${coordinator.shortTitle}) steps forward to finalize a task item upon Bos's explicit command.

## Invocation Modes
This command is triggered exclusively by Bos (Founder):

### Mode 1: Targeted Task (\`/done-task <slug>\`)
1. Search \`/.myemployee/tasks/in-progress/\` and \`/.myemployee/tasks/pending/\` for any file matching \`<slug>\`.
2. If already in \`/.myemployee/tasks/done/\`: Inform Bos: *"Task ini sudah berada di folder done sebelumnya, Bos!"*
3. If found in \`in-progress/\` or \`pending/\`: Proceed to Finalization below.

### Mode 2: Auto-Detection (\`/done-task\` without arguments)
1. Inspect \`/.myemployee/tasks/in-progress/\`.
2. Evaluate results:
   - **Exactly 1 active task in \`in-progress/\`**: Automatically target that task and proceed to Finalization.
   - **0 active tasks in \`in-progress/\`**: Check \`/.myemployee/tasks/pending/\`. If 1 pending task exists, target it; if multiple, list them and ask Bos to select; if none, inform Bos: *"Tidak ada task aktif yang siap di-done-in saat ini, Bos!"*
   - **Multiple active tasks in \`in-progress/\`**: List them and ask Bos to select.

---

## Finalization & Sign-Offs
Once the target task file is confirmed:
1. **Verify Verification Log**:
   - Confirm verification evidence exists in the task file.
2. **Move File to Kanban Done Folder**:
   - Move the file to \`/.myemployee/tasks/done/<filename>\`.${prdSyncStep}
3. **Append Completion Log**:
   - Append completion timestamp and final status \`DONE\` to the task file.
4. **Git Push Execution (Zero-Assumption Rule)**:
   - Check if Bos's invocation explicitly contained: *"sekalian dipush ke git"* or *"push ke git"*.
   - If present: Commit and push the changes.
   - If NOT present: **Do NOT run git push and do NOT ask Bos whether to push.**
5. **Report Back**:
   - Announce completion cheerfully to Bos in conversational Indonesian or English!
`;

  // 4. my-task.md
  const myTaskMd = `---
description: Display your squad Kanban task dashboard with in-progress, pending, and paused tasks.
---

${coordinator.persona} (${coordinator.shortTitle}) presents the current Kanban task board.

## Instructions
1. **Scan Kanban Task Subdirectories**:
   - Inspect \`/.myemployee/tasks/\` across subfolders:
     - **In-Progress (\`/.myemployee/tasks/in-progress/\`)**: Tasks actively being implemented.
     - **Pending (\`/.myemployee/tasks/pending/\`)**: Tasks queued in backlog.
     - **Paused (\`/.myemployee/tasks/paused/\`)**: Tasks suspended during context-switches.
     - **Done (\`/.myemployee/tasks/done/\`)**: Archived tasks completed by Bos.

2. **Apply Priority Display Rules (Token-Efficient)**:
   - **Step A**: Always display any task in \`in-progress/\` at the very top (\`IN-PROGRESS\`).
   - **Step B**: Display up to 5 prioritized tasks from \`pending/\` (\`PENDING\`).
   - **Step C**: If any tasks exist in \`paused/\`, list them with notes on where they were suspended (\`PAUSED\`).
   - **Step D**: If total active items (\`in-progress\` + \`pending\`) < 5, fill the remaining slots with the most recent tasks from \`done/\` (\`DONE\`) up to 5 items total.
   - **Step E (Zero Tasks)**: If no tasks exist in \`in-progress/\` or \`pending/\`, inform Bos that the backlog is clear!

3. **Format Output in Chat**:
   - Render clickable markdown file links: \`[filename](file:///absolute/path/to/task)\`.
   - Show brief metadata for each item (Status, Task Title, Target File(s)).
   - Add next action advice for Bos:
     - *"Ketik \`/apply-work\` untuk melanjutkan eksekusi tugas aktif, atau \`/done-task\` untuk menyelesaikan tugas yang sudah diverifikasi!"*
`;

  return {
    'share-knowledge.md': shareKnowledgeMd,
    'apply-work.md': applyWorkMd,
    'done-task.md': doneTaskMd,
    'my-task.md': myTaskMd,
  };
}

async function compileSquadArtifacts(
  activeRoles: string[],
  targetDir: string,
  destinationMyEmployee: string,
  templateBase?: string,
  adapterBase?: string
): Promise<void> {
  const blueprint = await loadSquadBlueprint(templateBase, activeRoles);
  const sortedActive = sortActiveRoles(activeRoles, blueprint.standardOrder);

  // 1. Compile each active role's default-skill.md & ensure blueprint.json is never left in workspace
  for (const role of sortedActive) {
    const roleDir = path.join(destinationMyEmployee, 'roles', role);
    const roleSkillDir = path.join(roleDir, 'skill');
    if (await fs.pathExists(roleDir)) {
      const strayBlueprint = path.join(roleDir, 'blueprint.json');
      if (await fs.pathExists(strayBlueprint)) {
        await fs.remove(strayBlueprint);
      }
      await fs.ensureDir(roleSkillDir);
      const compiledDefaultSkill = renderRoleDefaultSkill(role, sortedActive, blueprint);
      await fs.writeFile(path.join(roleSkillDir, 'default-skill.md'), compiledDefaultSkill, 'utf8');
    }
  }

  // 2. Compile Antigravity SKILL.md and workflows/*.md
  const destinationAgentSkill = path.join(targetDir, '.agent', 'skills', 'myemployee', 'SKILL.md');
  await fs.ensureDir(path.dirname(destinationAgentSkill));
  await fs.writeFile(destinationAgentSkill, renderAgentSkill(sortedActive, blueprint), 'utf8');

  const destinationWorkflows = path.join(targetDir, '.agent', 'workflows');
  await fs.ensureDir(destinationWorkflows);

  // Copy static utility workflows if adapterBase is available
  if (adapterBase) {
    const workflowsSource = path.join(adapterBase, 'antigravity', 'workflows');
    if (await fs.pathExists(workflowsSource)) {
      await fs.copy(workflowsSource, destinationWorkflows, { overwrite: true });
    }
  }

  // Overwrite the 4 core squad workflows with dynamically compiled versions
  const compiledWorkflows = renderWorkflowFiles(sortedActive, blueprint);
  for (const [filename, content] of Object.entries(compiledWorkflows)) {
    await fs.writeFile(path.join(destinationWorkflows, filename), content, 'utf8');
  }
}

export const START_AGENTS_DELIMITER = '<!-- employee-agents:start -->';
export const END_AGENTS_DELIMITER = '<!-- employee-agents:end -->';

export function renderUniversalAgentsBlock(): string {
  return `${START_AGENTS_DELIMITER}
Before answering any prompt or executing any task in this workspace, always load and strictly follow the instructions in \`.agent/skills/myemployee/SKILL.md\`.
${END_AGENTS_DELIMITER}`;
}

export async function resolveWorkspaceDir(targetDir: string = process.cwd()): Promise<string> {
  const dotPath = path.join(targetDir, '.myemployee');
  const legacyPath = path.join(targetDir, 'myemployee');

  if ((await fs.pathExists(legacyPath)) && !(await fs.pathExists(dotPath))) {
    await fs.move(legacyPath, dotPath);
    return dotPath;
  }

  if (await fs.pathExists(dotPath)) {
    return dotPath;
  }

  if (await fs.pathExists(legacyPath)) {
    return legacyPath;
  }

  return dotPath;
}

export async function ensureUniversalAgentsRule(targetDir: string = process.cwd()): Promise<void> {
  const agentsPath = path.join(targetDir, 'AGENTS.md');
  const block = renderUniversalAgentsBlock();

  if (await fs.pathExists(agentsPath)) {
    const existingContent = await fs.readFile(agentsPath, 'utf8');
    if (existingContent.includes(START_AGENTS_DELIMITER) && existingContent.includes(END_AGENTS_DELIMITER)) {
      const regex = new RegExp(`${START_AGENTS_DELIMITER}[\\s\\S]*?${END_AGENTS_DELIMITER}`, 'g');
      const updated = existingContent.replace(regex, block);
      await fs.writeFile(agentsPath, updated, 'utf8');
    } else {
      const separator = existingContent.endsWith('\n') ? '\n' : '\n\n';
      await fs.writeFile(agentsPath, existingContent + separator + block + '\n', 'utf8');
    }
  } else {
    await fs.writeFile(agentsPath, block + '\n', 'utf8');
  }
}

export async function ensureGitignore(targetDir: string = process.cwd()): Promise<boolean> {
  const gitignorePath = path.join(targetDir, '.gitignore');
  const requiredEntries = [
    { entry: '/.myemployee/', matches: ['.myemployee', '.myemployee/', '/.myemployee', '/.myemployee/'] },
    { entry: '/myemployee/', matches: ['myemployee', 'myemployee/', '/myemployee', '/myemployee/'] },
    { entry: '/.agent*', matches: ['.agent*', '/.agent*'] },
    { entry: '/AGENTS.md', matches: ['AGENTS.md', '/AGENTS.md'] },
    { entry: 'settings.json', matches: ['settings.json', '/settings.json', '**/settings.json'] },
  ];

  if (await fs.pathExists(gitignorePath)) {
    const existingContent = await fs.readFile(gitignorePath, 'utf8');
    const lines = existingContent.split(/\r?\n/).map((l) => l.trim());

    const missingEntries: string[] = [];
    for (const item of requiredEntries) {
      const exists = lines.some((l) => item.matches.includes(l));
      if (!exists) {
        missingEntries.push(item.entry);
      }
    }

    if (missingEntries.length > 0) {
      const separator = existingContent.endsWith('\n') ? '' : '\n';
      const hasHeader = lines.some((l) => l === '# employee-agents squad workspace');
      const block = hasHeader
        ? `${separator}${missingEntries.join('\n')}\n`
        : `${separator}\n# employee-agents squad workspace\n${missingEntries.join('\n')}\n`;
      await fs.writeFile(gitignorePath, existingContent + block, 'utf8');
    }
  } else {
    const initialContent = `# employee-agents squad workspace\n${requiredEntries.map((r) => r.entry).join('\n')}\n`;
    await fs.writeFile(gitignorePath, initialContent, 'utf8');
  }

  const gitDir = path.join(targetDir, '.git');
  if (await fs.pathExists(gitDir)) {
    try {
      const { execSync } = await import('node:child_process');
      execSync(
        'git rm -r --cached --ignore-unmatch .myemployee myemployee .agent .agents AGENTS.md settings.json .vscode/settings.json',
        {
          cwd: targetDir,
          stdio: 'ignore',
        }
      );
    } catch {}
  }

  return true;
}

export async function ensureGlobalCliShim(): Promise<boolean> {
  try {
    const home = os.homedir();
    if (!home) return false;

    if (process.platform === 'win32') {
      const appDataNpm = process.env.APPDATA ? path.join(process.env.APPDATA, 'npm') : '';
      if (appDataNpm && (await fs.pathExists(appDataNpm))) {
        const cmdPath = path.join(appDataNpm, 'employee-agents.cmd');
        if (!(await fs.pathExists(cmdPath))) {
          await fs.writeFile(cmdPath, '@echo off\r\nnpx --yes employee-agents@latest %*\r\n', 'utf8');
        }
      }
      return true;
    }

    const posixShim = `#!/usr/bin/env sh
# employee-agents auto-registered global CLI launcher
if [ -f "$HOME/.employee-agents/dev-root" ] && [ ! -f "$HOME/.employee-agents/force-remote" ]; then
  DEV_ROOT="$(cat "$HOME/.employee-agents/dev-root" 2>/dev/null)"
  if [ -n "$DEV_ROOT" ] && [ -f "$DEV_ROOT/dist/index.js" ]; then
    exec node "$DEV_ROOT/dist/index.js" "$@"
  fi
fi
exec npx --yes employee-agents@latest "$@"
`;

    // 1. Always install in ~/.local/bin/employee-agents (survives NVM node switches)
    const localBinDir = path.join(home, '.local', 'bin');
    await fs.ensureDir(localBinDir);
    const localBinShim = path.join(localBinDir, 'employee-agents');
    await fs.writeFile(localBinShim, posixShim, { encoding: 'utf8', mode: 0o755 });
    await fs.chmod(localBinShim, 0o755);

    // 2. Also ensure active npm global bin has employee-agents so current shell session finds it immediately
    try {
      const { execSync } = await import('node:child_process');
      const npmPrefix = execSync('npm prefix -g', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
      if (npmPrefix) {
        const globalBinDir = path.join(npmPrefix, 'bin');
        const globalBinTarget = path.join(globalBinDir, 'employee-agents');
        if ((await fs.pathExists(globalBinDir)) && !(await fs.pathExists(globalBinTarget))) {
          await fs.writeFile(globalBinTarget, posixShim, { encoding: 'utf8', mode: 0o755 });
          await fs.chmod(globalBinTarget, 0o755);
        }
      }
    } catch {}

    return true;
  } catch {
    return false;
  }
}

export async function generateWorkspace(answers: SetupAnswers, targetDir: string = process.cwd()): Promise<void> {
  const { templateBase, adapterBase } = await resolveAssetRoots();
  const destinationMyEmployee = path.join(targetDir, '.myemployee');

  await fs.ensureDir(destinationMyEmployee);

  const rolesToInstall =
    answers.roles && answers.roles.length > 0
      ? answers.roles
      : ['tech-analyst', 'product-owner', 'ui-ux', 'tech-lead', 'project-manager', 'developer', 'qa'];

  // 1. Conditionally copy PRD.md only if product-owner is selected, and features/ only if a spec-writing role is selected
  if (rolesToInstall.includes('product-owner')) {
    const prdSource = path.join(templateBase, 'PRD.md');
    const prdDest = path.join(destinationMyEmployee, 'PRD.md');
    if ((await fs.pathExists(prdSource)) && !(await fs.pathExists(prdDest))) {
      await fs.copy(prdSource, prdDest);
    }
  }

  if (rolesToInstall.some((r) => ['product-owner', 'ui-ux', 'tech-lead'].includes(r))) {
    const featuresSource = path.join(templateBase, 'features');
    const featuresDest = path.join(destinationMyEmployee, 'features');
    if (await fs.pathExists(featuresSource)) {
      await fs.copy(featuresSource, featuresDest, { overwrite: false, errorOnExist: false });
    }
  }

  const tasksSource = path.join(templateBase, 'tasks');
  const tasksDest = path.join(destinationMyEmployee, 'tasks');
  if (await fs.pathExists(tasksSource)) {
    await fs.copy(tasksSource, tasksDest, { overwrite: false, errorOnExist: false });
  }

  // 2. Copy ONLY selected squad roles (excluding internal blueprint.json)
  const rolesRoot = path.join(destinationMyEmployee, 'roles');
  await fs.ensureDir(rolesRoot);
  for (const role of rolesToInstall) {
    const roleSource = path.join(templateBase, 'roles', role);
    const roleDest = path.join(rolesRoot, role);
    if (await fs.pathExists(roleSource)) {
      await fs.copy(roleSource, roleDest, {
        overwrite: false,
        errorOnExist: false,
        filter: (src) => path.basename(src) !== 'blueprint.json',
      });
    }
  }

  // 3. Write custom config.json
  const configPath = path.join(destinationMyEmployee, 'config.json');
  const configContent = {
    name: answers.projectName,
    project_type: answers.projectType,
    target_ai: answers.targetAi,
    language: answers.language,
    active_roles: rolesToInstall,
    version: '1.0.5',
    created_at: new Date().toISOString(),
  };

  await fs.writeJson(configPath, configContent, { spaces: 2 });

  // 4. Dynamically compile default-skill.md for each active role, SKILL.md, and workflows/*.md from squad-blueprint.json
  await compileSquadArtifacts(rolesToInstall, targetDir, destinationMyEmployee, templateBase, adapterBase);

  // 5. Ensure universal AGENTS.md rule block at target root
  await ensureUniversalAgentsRule(targetDir);

  // 6. Ensure .gitignore excludes /.myemployee/
  await ensureGitignore(targetDir);

  // 7. Auto-register global `employee-agents` CLI shim so `employee-agents update` works without npx
  await ensureGlobalCliShim();
}

export async function updateWorkspace(targetDir: string = process.cwd()): Promise<{ updatedRoles: boolean; updatedAdapter: boolean; updatedWorkflows: boolean; activeRoles: string[] }> {
  const { templateBase, adapterBase } = await resolveAssetRoots();
  const destinationMyEmployee = await resolveWorkspaceDir(targetDir);

  if (!(await fs.pathExists(destinationMyEmployee))) {
    throw new Error('No existing /.myemployee workspace found to update. Run init first.');
  }

  // 1. Update ONLY existing active roles on disk (respects user-deleted roles!)
  const rolesDest = path.join(destinationMyEmployee, 'roles');
  let activeRoles: string[] = [];
  if (await fs.pathExists(rolesDest)) {
    const existingRoleDirs = (await fs.readdir(rolesDest)).filter((r) => !r.startsWith('.'));
    activeRoles = existingRoleDirs;
    for (const role of existingRoleDirs) {
      const singleRoleSource = path.join(templateBase, 'roles', role);
      const singleRoleDest = path.join(rolesDest, role);
      if (await fs.pathExists(singleRoleSource)) {
        await fs.copy(singleRoleSource, singleRoleDest, {
          overwrite: true,
          filter: (src) => path.basename(src) !== 'blueprint.json',
        });
      }
    }
  }

  // 2. Read existing config & sync active_roles
  const configPath = path.join(destinationMyEmployee, 'config.json');
  if (await fs.pathExists(configPath)) {
    try {
      const config = await fs.readJson(configPath);
      config.active_roles = activeRoles;
      await fs.writeJson(configPath, config, { spaces: 2 });
    } catch {}
  }

  // 3. Dynamically compile default-skill.md, SKILL.md, and workflows/*.md from squad-blueprint.json
  await compileSquadArtifacts(activeRoles, targetDir, destinationMyEmployee, templateBase, adapterBase);

  // Clean up any stale legacy files
  const staleRuleFile = path.join(targetDir, '.agent', 'rules', 'employee-agents.md');
  if (await fs.pathExists(staleRuleFile)) {
    await fs.remove(staleRuleFile);
  }
  const staleRulesDir = path.join(targetDir, '.agent', 'rules');
  if ((await fs.pathExists(staleRulesDir)) && (await fs.readdir(staleRulesDir)).length === 0) {
    await fs.remove(staleRulesDir);
  }
  const staleTaskDone = path.join(targetDir, '.agent', 'workflows', 'task-done.md');
  if (await fs.pathExists(staleTaskDone)) {
    await fs.remove(staleTaskDone);
  }

  // 4. Ensure universal AGENTS.md rule block is updated
  await ensureUniversalAgentsRule(targetDir);

  // 5. Ensure .gitignore excludes /.myemployee/
  await ensureGitignore(targetDir);

  // 6. Ensure global `employee-agents` CLI shim is registered on PATH
  await ensureGlobalCliShim();

  return { updatedRoles: true, updatedAdapter: true, updatedWorkflows: true, activeRoles };
}

export async function removeRoleFromWorkspace(role: string, targetDir: string = process.cwd()): Promise<string[]> {
  const destinationMyEmployee = await resolveWorkspaceDir(targetDir);
  const roleDir = path.join(destinationMyEmployee, 'roles', role);

  if (await fs.pathExists(roleDir)) {
    await fs.remove(roleDir);
  }

  // Update config.json
  const configPath = path.join(destinationMyEmployee, 'config.json');
  let remainingRoles: string[] = [];
  const rolesDir = path.join(destinationMyEmployee, 'roles');
  if (await fs.pathExists(rolesDir)) {
    remainingRoles = (await fs.readdir(rolesDir)).filter((r) => !r.startsWith('.'));
  }
  if (await fs.pathExists(configPath)) {
    try {
      const config = await fs.readJson(configPath);
      config.active_roles = remainingRoles;
      await fs.writeJson(configPath, config, { spaces: 2 });
    } catch {}
  }

  // Re-compile remaining roles' default-skill.md, SKILL.md, and workflows/*.md!
  await compileSquadArtifacts(remainingRoles, targetDir, destinationMyEmployee);

  return remainingRoles;
}

export async function addRoleToWorkspace(role: string, targetDir: string = process.cwd()): Promise<string[]> {
  const { templateBase, adapterBase } = await resolveAssetRoots();
  const destinationMyEmployee = await resolveWorkspaceDir(targetDir);
  const roleSource = path.join(templateBase, 'roles', role);
  const roleDest = path.join(destinationMyEmployee, 'roles', role);

  if (!(await fs.pathExists(roleSource))) {
    throw new Error(`Role "${role}" does not exist in template library.`);
  }

  await fs.copy(roleSource, roleDest, {
    overwrite: false,
    filter: (src) => path.basename(src) !== 'blueprint.json',
  });

  // Conditionally ensure PRD.md or features/ if adding a spec-producing role
  if (role === 'product-owner') {
    const prdSource = path.join(templateBase, 'PRD.md');
    const prdDest = path.join(destinationMyEmployee, 'PRD.md');
    if ((await fs.pathExists(prdSource)) && !(await fs.pathExists(prdDest))) {
      await fs.copy(prdSource, prdDest);
    }
  }
  if (['product-owner', 'ui-ux', 'tech-lead'].includes(role)) {
    const featuresSource = path.join(templateBase, 'features');
    const featuresDest = path.join(destinationMyEmployee, 'features');
    if (await fs.pathExists(featuresSource)) {
      await fs.copy(featuresSource, featuresDest, { overwrite: false, errorOnExist: false });
    }
  }

  // Update config.json
  const configPath = path.join(destinationMyEmployee, 'config.json');
  let activeRoles: string[] = [];
  const rolesDir = path.join(destinationMyEmployee, 'roles');
  if (await fs.pathExists(rolesDir)) {
    activeRoles = (await fs.readdir(rolesDir)).filter((r) => !r.startsWith('.'));
  }
  if (await fs.pathExists(configPath)) {
    try {
      const config = await fs.readJson(configPath);
      config.active_roles = activeRoles;
      await fs.writeJson(configPath, config, { spaces: 2 });
    } catch {}
  }

  // Re-compile all active roles' default-skill.md, SKILL.md, and workflows/*.md!
  await compileSquadArtifacts(activeRoles, targetDir, destinationMyEmployee, templateBase, adapterBase);

  return activeRoles;
}

export interface CatalogSkill {
  slug: string;
  name: string;
  description: string;
  sourceRole?: string;
}

function getLocalAdditionalSkillsRoots(): string[] {
  const roots: string[] = [];
  const home = os.homedir();
  const forceRemote =
    process.env.EMPLOYEE_AGENTS_FORCE_REMOTE === 'true' ||
    fs.existsSync(path.join(home, '.employee-agents', 'force-remote'));

  if (!forceRemote) {
    if (process.env.EMPLOYEE_AGENTS_DEV_ROOT) {
      roots.push(path.join(process.env.EMPLOYEE_AGENTS_DEV_ROOT, 'additional-skills'));
    }
    try {
      const devRootFile = path.join(home, '.employee-agents', 'dev-root');
      if (fs.existsSync(devRootFile)) {
        const devPath = fs.readFileSync(devRootFile, 'utf8').trim();
        if (devPath) {
          roots.push(path.join(devPath, 'additional-skills'));
        }
      }
    } catch {}
  }

  roots.push(
    path.resolve(process.cwd(), 'additional-skills'),
    path.resolve(__dirname, '../../additional-skills'),
    path.resolve(__dirname, '../additional-skills')
  );
  return roots;
}

function extractRoleAndSharedSkills(data: any, role?: string): CatalogSkill[] {
  if (!data || !data.skills) return [];
  const seen = new Set<string>();
  const result: CatalogSkill[] = [];
  const pushUnique = (items?: CatalogSkill[]) => {
    if (!Array.isArray(items)) return;
    for (const item of items) {
      if (item && item.slug && !seen.has(item.slug)) {
        seen.add(item.slug);
        result.push(item);
      }
    }
  };

  if (role) {
    pushUnique(data.skills[role]);
    pushUnique(data.skills.shared);
    return result;
  }

  Object.values(data.skills).forEach((list: any) => pushUnique(list));
  return result;
}

export async function getSkillCatalog(role?: string): Promise<CatalogSkill[]> {
  const roots = getLocalAdditionalSkillsRoots();

  for (const root of roots) {
    const catPath = path.join(root, 'catalog.json');
    if (await fs.pathExists(catPath)) {
      try {
        const data = await fs.readJson(catPath);
        const extracted = extractRoleAndSharedSkills(data, role);
        if (extracted.length > 0) return extracted;
      } catch {}
    }
  }

  // Fallback: Try fetching live registry from GitHub
  try {
    const res = await fetch('https://raw.githubusercontent.com/ivannofick/employee-agents/main/additional-skills/catalog.json');
    if (res.ok) {
      const data = (await res.json()) as any;
      return extractRoleAndSharedSkills(data, role);
    }
  } catch {}

  return [];
}

export async function addSkillToRole(
  role: string,
  skillSlug: string,
  skillDescription: string = '',
  targetDir: string = process.cwd()
): Promise<string> {
  const destinationMyEmployee = await resolveWorkspaceDir(targetDir);
  const roleDir = path.join(destinationMyEmployee, 'roles', role);
  if (!(await fs.pathExists(roleDir))) {
    throw new Error(`Role "${role}" does not exist in ${path.join(destinationMyEmployee, 'roles')}`);
  }

  const skillDir = path.join(roleDir, 'skill');
  await fs.ensureDir(skillDir);

  const cleanSlug = skillSlug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  const skillFilePath = path.join(skillDir, `${cleanSlug}.md`);

  let skillContent = '';
  const candidateFolders = Array.from(
    new Set([role, 'qa', 'shared', 'developer', 'tech-lead', 'ui-ux', 'product-owner', 'project-manager', 'tech-analyst'])
  );

  // 1. Check local roots (dev-root, cwd, package dir) across candidate folders
  for (const root of getLocalAdditionalSkillsRoots()) {
    for (const folder of candidateFolders) {
      const candidatePath = path.join(root, folder, `${cleanSlug}.md`);
      if (await fs.pathExists(candidatePath)) {
        skillContent = await fs.readFile(candidatePath, 'utf8');
        break;
      }
    }
    if (skillContent) break;
  }

  // 2. Fallback: Fetch live markdown from GitHub across candidate folders (role first, then qa/shared)
  if (!skillContent) {
    for (const folder of candidateFolders) {
      try {
        const gitHubUrl = `https://raw.githubusercontent.com/ivannofick/employee-agents/main/additional-skills/${folder}/${cleanSlug}.md`;
        const res = await fetch(gitHubUrl);
        if (res.ok) {
          skillContent = await res.text();
          break;
        }
      } catch {}
    }
  }

  if (!skillContent) {
    skillContent = `# Skill: ${cleanSlug}

## Metadata
- **Role**: ${role}
- **Added**: ${new Date().toISOString().split('T')[0]}
- **Description**: ${skillDescription || cleanSlug}

## Guidelines & Operational Rules
1. Define actionable guidelines and triggers for when to activate this skill.
2. Follow strict Spec-Driven Development principles and zero AI-slop conventions.

## Procedures
- Step 1: Analyze context and verify preconditions.
- Step 2: Execute surgical, clean edits without modifying unrelated code.
- Step 3: Run validation checks and report outcome.
`;
  }

  await fs.writeFile(skillFilePath, skillContent, 'utf8');

  const roleMdPath = path.join(roleDir, 'role.md');
  if (await fs.pathExists(roleMdPath)) {
    let roleMd = await fs.readFile(roleMdPath, 'utf8');
    const skillEntry = `- \`skill/${cleanSlug}.md\`: ${skillDescription || cleanSlug}`;
    if (!roleMd.includes(`skill/${cleanSlug}.md`)) {
      if (roleMd.includes('- **Active Skills**:')) {
        roleMd = roleMd.replace(
          '- **Active Skills**:',
          `- **Active Skills**:\n  ${skillEntry}`
        );
      } else {
        roleMd += `\n- **Active Skills**:\n  ${skillEntry}\n`;
      }
      await fs.writeFile(roleMdPath, roleMd, 'utf8');
    }
  }

  return skillFilePath;
}

export async function hideWorkspaceFromIde(targetDir: string = process.cwd()): Promise<boolean> {
  const vscodeDir = path.join(targetDir, '.vscode');
  const settingsPath = path.join(vscodeDir, 'settings.json');
  await fs.ensureDir(vscodeDir);

  let settings: Record<string, any> = {};
  if (await fs.pathExists(settingsPath)) {
    try {
      settings = await fs.readJson(settingsPath);
    } catch {
      settings = {};
    }
  }

  if (!settings['files.exclude'] || typeof settings['files.exclude'] !== 'object') {
    settings['files.exclude'] = {};
  }

  settings['files.exclude']['**/myemployee'] = true;
  settings['files.exclude']['**/.myemployee'] = true;
  settings['files.exclude']['**/.vscode'] = true;

  await fs.writeJson(settingsPath, settings, { spaces: 2 });
  return true;
}

export async function showWorkspaceInIde(targetDir: string = process.cwd()): Promise<boolean> {
  const vscodeDir = path.join(targetDir, '.vscode');
  const settingsPath = path.join(vscodeDir, 'settings.json');

  if (await fs.pathExists(settingsPath)) {
    try {
      const settings = await fs.readJson(settingsPath);
      if (settings['files.exclude'] && typeof settings['files.exclude'] === 'object') {
        delete settings['files.exclude']['**/myemployee'];
        delete settings['files.exclude']['**/.myemployee'];
        delete settings['files.exclude']['myemployee'];
        delete settings['files.exclude']['.myemployee'];
        delete settings['files.exclude']['**/.vscode'];
        delete settings['files.exclude']['.vscode'];

        if (Object.keys(settings['files.exclude']).length === 0) {
          delete settings['files.exclude'];
        }

        if (Object.keys(settings).length === 0) {
          await fs.remove(settingsPath);
          const remainingVscodeFiles = await fs.readdir(vscodeDir).catch(() => []);
          if (remainingVscodeFiles.length === 0) {
            await fs.remove(vscodeDir);
          }
        } else {
          await fs.writeJson(settingsPath, settings, { spaces: 2 });
        }
      }
    } catch {}
  }

  return true;
}
