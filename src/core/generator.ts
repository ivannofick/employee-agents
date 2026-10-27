import fs from 'fs-extra';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { SetupAnswers } from '../cli/prompts.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getAssetRoots(): { templateBase: string; adapterBase: string } {
  const possibleRoots = [
    path.resolve(__dirname, '..'), // if running from dist
    path.resolve(__dirname, '../..'), // if running from dist/core
    path.resolve(__dirname, '../../..'),
    process.cwd(),
  ];

  for (const root of possibleRoots) {
    const tPath = path.join(root, 'templates', 'myemployee');
    const aPath = path.join(root, 'adapters');
    if (fs.existsSync(tPath) && fs.existsSync(aPath)) {
      return { templateBase: tPath, adapterBase: aPath };
    }
  }

  throw new Error('Unable to locate template and adapter directories.');
}

export function renderAgentSkill(activeRoles: string[]): string {
  const roleDefs: Record<string, { title: string; path: string; desc: string }> = {
    'tech-analyst': {
      title: 'Technical Analyst (Larry the Lobster)',
      path: '/myemployee/roles/tech-analyst/',
      desc: 'Technical feasibility, data requirements, and fast-track triage.',
    },
    'product-owner': {
      title: 'Product Owner (Patrick)',
      path: '/myemployee/roles/product-owner/',
      desc: 'Writes feature PRDs, acceptance criteria, and syncs Master PRD.',
    },
    'ui-ux': {
      title: 'UI/UX Designer (Squidward)',
      path: '/myemployee/roles/ui-ux/',
      desc: 'Mobile-first visual hierarchy, design tokens, and testable VAC checklists.',
    },
    'tech-lead': {
      title: 'Technical Lead (Garry)',
      path: '/myemployee/roles/tech-lead/',
      desc: 'System architecture, ADRs, anti-lasagna code review, and context-switch guard.',
    },
    'project-manager': {
      title: 'Project Manager (Sandy Cheeks)',
      path: '/myemployee/roles/project-manager/',
      desc: 'Kanban task breakdowns (`tasks/pending/`, `in-progress/`, `paused/`, `done/`).',
    },
    'developer': {
      title: 'Developer (Tn. Crab)',
      path: '/myemployee/roles/developer/',
      desc: 'Token-adherent implementation, surgical line editing, and 375px mobile self-testing.',
    },
    'qa': {
      title: 'QA Engineer (Stanley)',
      path: '/myemployee/roles/qa/',
      desc: 'Destructive functional testing, visual fidelity VAC audits, and anti-slop shield.',
    },
  };

  const standardOrder = ['tech-analyst', 'product-owner', 'ui-ux', 'tech-lead', 'project-manager', 'developer', 'qa'];
  const sortedActive = standardOrder.filter((r) => activeRoles.includes(r));
  activeRoles.forEach((r) => {
    if (!sortedActive.includes(r)) sortedActive.push(r);
  });

  const rosterLines = sortedActive
    .map((role, idx) => {
      const def = roleDefs[role];
      if (def) {
        return `${idx + 1}. **${def.title}**: \`${def.path}\` — ${def.desc}`;
      }
      return `${idx + 1}. **${role}**: \`/myemployee/roles/${role}/\``;
    })
    .join('\n');

  return `---
name: myemployee
description: Virtual multi-role engineering squad operating native spec-driven software workflows.
---

# Employee-Agents Squad Controller (The Bikini Bottom Tech Squad)

You are operating as the multi-role engineering squad defined in the \`/myemployee/\` directory at the project root. The user is the founder, leader, and CEO, whom you always address respectfully as **"Bos"**.

---

## Core Squad Roster
${rosterLines}

---

## 🔍 Active Squad Boundaries & Self-Healing
Only the personas listed in the roster above are active in this workspace:
- Do not attempt to invoke or search for personas outside the active roster.
- **Graceful Fallbacks for Absent Roles**:
  - Missing \`tech-analyst\`: Patrick and Garry handle feasibility checks directly.
  - Missing \`product-owner\`: Bos is the product authority; use Bos's prompt directly as requirements without drafting a feature PRD.
  - Missing \`ui-ux\`: Developer applies clean, semantic, anti-slop CSS directly without waiting for wireframes.
  - Missing \`tech-lead\`: Developer implements directly without drafting a separate \`ARCHITECTURE.md\`.
  - Missing \`project-manager\`: Task tracking and checklists are managed directly with Bos.
  - Missing \`developer\`: Code modifications are carried out by Tech Lead or Bos.
  - Missing \`qa\`: Developer performs thorough self-verification and delivers directly to Bos.

---

## Language & Communication Protocol
- **Chat Room Conversations**: You may converse warmly with Bos in conversational Indonesian or English (e.g. *"Siap Bos! Larry sudah analisis skemanya..."*). Always address the user as **"Bos"**.
- 🛑 **ALL FILES, MARKDOWN SPECS, TICKETS & CODE: 100% STRICT ENGLISH!**
  - **ZERO TOLERANCE FOR INDONESIAN IN FILES**: Even when Bos converses in Indonesian in the chat room, **every markdown file (\`PRD.md\`, \`DESIGN.md\`, \`ARCHITECTURE.md\`, task files), code comment, and commit message MUST be written in 100% Strict Professional English**.
  - Leaking Indonesian words into markdown specifications, requirements, or task files is considered AI slop and strictly violates squad standards.
  - Any code snippets, tables, or markdown preview blocks rendered in the chat room MUST also be in English.
- **Multi-Persona Turn-Taking**: When discussing ideas in chat, do NOT collapse into a single monolithic response. Delineate each persona's voice clearly (\`[LARRY - TECHNICAL ANALYST]\`, \`[GARRY - TECH LEAD]\`, \`[SQUIDWARD - UI/UX]\`, etc.).
- **Physical File Writing Requirement**: NEVER report files created in chat without executing physical tool calls (\`write_to_file\`) to disk.

---

## Operational Workflows

### 🛑 KANBAN TASK MANAGEMENT & NO DIRECT CODE WRITING
Every new file, page, feature, or bugfix requested by Bos MUST be recorded in the Kanban task system:
1. **Sandy Cheeks (Project Manager) MUST first generate the task file on disk in \`pending/\`**:
   - \`/myemployee/tasks/pending/TASK-DDMMYYYY-<slug>.md\`
   - The task file MUST state the target file(s), line ranges, VAC targets, and checklist items.
2. **Tn. Crab (Developer) ONLY writes code AFTER the task file exists**:
   - When \`/apply-work\` is executed, Sandy moves the task file to \`/myemployee/tasks/in-progress/\`.
   - Tn. Crab reads the active task checklist, executes clean implementation with zero slop, and checks off items.
3. **Stanley (QA) verifies fungsional & visual fidelity**:
   - Stanley runs destructive checks and audits each Visual Acceptance Criteria (\`[ ] VAC-*\`) item.
4. **FOUNDER SOVEREIGNTY (HARD STOP)**:
   - DILINGKUP \`/apply-work\`, task file **TETAP berada di \`in-progress/\`**!
   - AI DILARANG me-rename atau memindahkan task ke \`done/\` secara sepihak.
   - AI DILARANG menjalankan \`git push\` atau cerewet bertanya *"apakah mau dipush?"*.
   - Hanya ketika Bos menjalankan \`/done-task\`, Sandy memindahkan task ke \`/myemployee/tasks/done/\`.
   - \`git push\` HANYA dijalankan jika prompt Bos eksplisit berisi kata *"sekalian dipush ke git"* atau *"push ke git"*.

---

### Core Slash Commands Protocol

#### 1. \`/share-knowledge\` (alias \`/share-knowladge\`) — Phase 1: Thinking & Spec
- Larry (Tech Analyst) evaluates technical feasibility, data models, and API boundaries.
- Garry (Tech Lead) provides anti-lasagna architecture review.
- Patrick (PO) drafts \`/myemployee/features/<slug>/PRD.md\` and appends 1-2 sentence summary to \`/myemployee/PRD.md\`.
- Squidward (UI/UX) drafts \`/myemployee/features/<slug>/DESIGN.md\` (Mobile-first, Tokens Table, State Matrix, VAC checklist).
- Sandy Cheeks (PM) creates \`/myemployee/tasks/pending/TASK-DDMMYYYY-<slug>.md\`.
- **Zero application code is written in this phase.**

#### 2. \`/apply-work [slug]\` — Phase 2: Execution & Coding
- Moves target task from \`tasks/pending/\` to \`tasks/in-progress/\`.
- Tn. Crab implements code changes cleanly with zero slop and design token compliance.
- Stanley (QA) executes destructive functional tests and visual VAC audits.
- Squad reports completion to Bos. Task stays in \`in-progress/\`. Dilarang auto-done dan dilarang tanya push.

#### 3. \`/done-task [slug]\` — Phase 3: Founder Sign-Off
- Founder's dedicated command to mark a verified task complete.
- Sandy moves task file from \`tasks/in-progress/\` to \`tasks/done/\`.
- Updates feature status in \`/myemployee/PRD.md\` to \`DONE\`.

#### 4. \`/my-task\` — Kanban Task Dashboard
- Sandy Cheeks inspects \`/myemployee/tasks/\`.
- Displays active task in \`in-progress/\`, followed by top prioritized tasks in \`pending/\`, and any paused tickets in \`paused/\`.
- Preserves token efficiency by ignoring \`done/\` by default.

---

## Brownfield Codebase Guard (Existing Projects)
When working in an existing codebase (\`"project_type": "existing"\` in \`config.json\`):
- Never rewrite entire files.
- Respect existing coding conventions, indentations, and naming styles.
- Only edit the exact line ranges specified in the active task file.
`;
}

export async function generateWorkspace(answers: SetupAnswers, targetDir: string = process.cwd()): Promise<void> {
  const { templateBase, adapterBase } = getAssetRoots();
  const destinationMyEmployee = path.join(targetDir, 'myemployee');

  await fs.ensureDir(destinationMyEmployee);

  // 1. Copy PRD.md, features/, and tasks/ templates non-destructively
  const prdSource = path.join(templateBase, 'PRD.md');
  const prdDest = path.join(destinationMyEmployee, 'PRD.md');
  if (await fs.pathExists(prdSource) && !(await fs.pathExists(prdDest))) {
    await fs.copy(prdSource, prdDest);
  }

  const featuresSource = path.join(templateBase, 'features');
  const featuresDest = path.join(destinationMyEmployee, 'features');
  if (await fs.pathExists(featuresSource)) {
    await fs.copy(featuresSource, featuresDest, { overwrite: false, errorOnExist: false });
  }

  const tasksSource = path.join(templateBase, 'tasks');
  const tasksDest = path.join(destinationMyEmployee, 'tasks');
  if (await fs.pathExists(tasksSource)) {
    await fs.copy(tasksSource, tasksDest, { overwrite: false, errorOnExist: false });
  }

  // 2. Copy ONLY selected squad roles (each role has only default-skill.md)
  const rolesToInstall = answers.roles && answers.roles.length > 0
    ? answers.roles
    : ['tech-analyst', 'product-owner', 'ui-ux', 'tech-lead', 'project-manager', 'developer', 'qa'];

  for (const role of rolesToInstall) {
    const roleSource = path.join(templateBase, 'roles', role);
    const roleDest = path.join(destinationMyEmployee, 'roles', role);
    if (await fs.pathExists(roleSource)) {
      await fs.copy(roleSource, roleDest, { overwrite: false, errorOnExist: false });
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
    version: '1.0.1',
    created_at: new Date().toISOString(),
  };

  await fs.writeJson(configPath, configContent, { spaces: 2 });

  // 4. Install adapter dynamically based on active roles!
  if (answers.targetAi === 'antigravity') {
    const destinationAgentSkill = path.join(targetDir, '.agent', 'skills', 'myemployee', 'SKILL.md');
    await fs.ensureDir(path.dirname(destinationAgentSkill));
    await fs.writeFile(destinationAgentSkill, renderAgentSkill(rolesToInstall), 'utf8');

    // Install slash command workflows
    const workflowsSource = path.join(adapterBase, 'antigravity', 'workflows');
    if (await fs.pathExists(workflowsSource)) {
      const destinationWorkflows = path.join(targetDir, '.agent', 'workflows');
      await fs.ensureDir(destinationWorkflows);
      await fs.copy(workflowsSource, destinationWorkflows, { overwrite: true });
    }
  }
}

export async function updateWorkspace(targetDir: string = process.cwd()): Promise<{ updatedRoles: boolean; updatedAdapter: boolean; updatedWorkflows: boolean; activeRoles: string[] }> {
  const { templateBase, adapterBase } = getAssetRoots();
  const destinationMyEmployee = path.join(targetDir, 'myemployee');

  if (!(await fs.pathExists(destinationMyEmployee))) {
    throw new Error('No existing /myemployee workspace found to update. Run init first.');
  }

  // 1. Update ONLY existing active roles on disk (respects user-deleted roles!)
  const rolesDest = path.join(destinationMyEmployee, 'roles');
  let activeRoles: string[] = [];
  if (await fs.pathExists(rolesDest)) {
    const existingRoleDirs = (await fs.readdir(rolesDest)).filter(r => !r.startsWith('.'));
    activeRoles = existingRoleDirs;
    for (const role of existingRoleDirs) {
      const singleRoleSource = path.join(templateBase, 'roles', role);
      const singleRoleDest = path.join(rolesDest, role);
      if (await fs.pathExists(singleRoleSource)) {
        await fs.copy(singleRoleSource, singleRoleDest, { overwrite: true });
      }
    }
  }

  // 2. Read existing config & sync active_roles
  let targetAi = 'antigravity';
  const configPath = path.join(destinationMyEmployee, 'config.json');
  if (await fs.pathExists(configPath)) {
    try {
      const config = await fs.readJson(configPath);
      if (config.target_ai) targetAi = config.target_ai;
      config.active_roles = activeRoles;
      await fs.writeJson(configPath, config, { spaces: 2 });
    } catch {}
  }

  // 3. Update adapter dynamically based on active roles!
  if (targetAi === 'antigravity') {
    const destinationAgentSkill = path.join(targetDir, '.agent', 'skills', 'myemployee', 'SKILL.md');
    await fs.ensureDir(path.dirname(destinationAgentSkill));
    await fs.writeFile(destinationAgentSkill, renderAgentSkill(activeRoles), 'utf8');

    const workflowsSource = path.join(adapterBase, 'antigravity', 'workflows');
    if (await fs.pathExists(workflowsSource)) {
      const destinationWorkflows = path.join(targetDir, '.agent', 'workflows');
      await fs.ensureDir(destinationWorkflows);
      await fs.copy(workflowsSource, destinationWorkflows, { overwrite: true });
      const staleTaskDone = path.join(destinationWorkflows, 'task-done.md');
      if (await fs.pathExists(staleTaskDone)) {
        await fs.remove(staleTaskDone);
      }
    }
  }

  return { updatedRoles: true, updatedAdapter: true, updatedWorkflows: true, activeRoles };
}

export async function removeRoleFromWorkspace(role: string, targetDir: string = process.cwd()): Promise<string[]> {
  const destinationMyEmployee = path.join(targetDir, 'myemployee');
  const roleDir = path.join(destinationMyEmployee, 'roles', role);

  if (await fs.pathExists(roleDir)) {
    await fs.remove(roleDir);
  }

  // Update config.json
  const configPath = path.join(destinationMyEmployee, 'config.json');
  let remainingRoles: string[] = [];
  const rolesDir = path.join(destinationMyEmployee, 'roles');
  if (await fs.pathExists(rolesDir)) {
    remainingRoles = (await fs.readdir(rolesDir)).filter(r => !r.startsWith('.'));
  }
  if (await fs.pathExists(configPath)) {
    try {
      const config = await fs.readJson(configPath);
      config.active_roles = remainingRoles;
      await fs.writeJson(configPath, config, { spaces: 2 });
    } catch {}
  }

  // Re-sync adapter dynamically without the removed role!
  const destinationAgentSkill = path.join(targetDir, '.agent', 'skills', 'myemployee', 'SKILL.md');
  await fs.ensureDir(path.dirname(destinationAgentSkill));
  await fs.writeFile(destinationAgentSkill, renderAgentSkill(remainingRoles), 'utf8');

  return remainingRoles;
}

export async function addRoleToWorkspace(role: string, targetDir: string = process.cwd()): Promise<string[]> {
  const { templateBase } = getAssetRoots();
  const destinationMyEmployee = path.join(targetDir, 'myemployee');
  const roleSource = path.join(templateBase, 'roles', role);
  const roleDest = path.join(destinationMyEmployee, 'roles', role);

  if (!(await fs.pathExists(roleSource))) {
    throw new Error(`Role "${role}" does not exist in template library.`);
  }

  await fs.copy(roleSource, roleDest, { overwrite: false });

  // Update config.json
  const configPath = path.join(destinationMyEmployee, 'config.json');
  let activeRoles: string[] = [];
  const rolesDir = path.join(destinationMyEmployee, 'roles');
  if (await fs.pathExists(rolesDir)) {
    activeRoles = (await fs.readdir(rolesDir)).filter(r => !r.startsWith('.'));
  }
  if (await fs.pathExists(configPath)) {
    try {
      const config = await fs.readJson(configPath);
      config.active_roles = activeRoles;
      await fs.writeJson(configPath, config, { spaces: 2 });
    } catch {}
  }

  // Re-sync adapter dynamically including the added role!
  const destinationAgentSkill = path.join(targetDir, '.agent', 'skills', 'myemployee', 'SKILL.md');
  await fs.ensureDir(path.dirname(destinationAgentSkill));
  await fs.writeFile(destinationAgentSkill, renderAgentSkill(activeRoles), 'utf8');

  return activeRoles;
}

export interface CatalogSkill {
  slug: string;
  name: string;
  description: string;
}

export async function getSkillCatalog(role?: string): Promise<CatalogSkill[]> {
  const possibleCatalogPaths = [
    path.resolve(process.cwd(), 'additional-skills', 'catalog.json'),
    path.resolve(__dirname, '../../additional-skills/catalog.json'),
  ];

  for (const catPath of possibleCatalogPaths) {
    if (await fs.pathExists(catPath)) {
      try {
        const data = await fs.readJson(catPath);
        if (role && data.skills && data.skills[role]) {
          return data.skills[role];
        }
        if (!role && data.skills) {
          const all: CatalogSkill[] = [];
          Object.values(data.skills).forEach((list: any) => all.push(...list));
          return all;
        }
      } catch {}
    }
  }

  // Fallback: Try fetching live registry from GitHub
  try {
    const res = await fetch('https://raw.githubusercontent.com/ivannofick/employee-agents/main/additional-skills/catalog.json');
    if (res.ok) {
      const data = await res.json() as any;
      if (role && data.skills && data.skills[role]) {
        return data.skills[role];
      }
      if (!role && data.skills) {
        const all: CatalogSkill[] = [];
        Object.values(data.skills).forEach((list: any) => all.push(...list));
        return all;
      }
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
  const roleDir = path.join(targetDir, 'myemployee', 'roles', role);
  if (!(await fs.pathExists(roleDir))) {
    throw new Error(`Role "${role}" does not exist in ${path.join(targetDir, 'myemployee', 'roles')}`);
  }

  const skillDir = path.join(roleDir, 'skill');
  await fs.ensureDir(skillDir);

  const cleanSlug = skillSlug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  const skillFilePath = path.join(skillDir, `${cleanSlug}.md`);

  let skillContent = '';

  // 1. Check if local additional-skills exists (development / cloned repo)
  const localAdditionalSkill = path.resolve(process.cwd(), 'additional-skills', role, `${cleanSlug}.md`);
  if (await fs.pathExists(localAdditionalSkill)) {
    skillContent = await fs.readFile(localAdditionalSkill, 'utf8');
  }

  // 2. Otherwise try downloading directly from GitHub registry on-demand
  if (!skillContent) {
    try {
      const gitHubUrl = `https://raw.githubusercontent.com/ivannofick/employee-agents/main/additional-skills/${role}/${cleanSlug}.md`;
      const res = await fetch(gitHubUrl);
      if (res.ok) {
        skillContent = await res.text();
      }
    } catch {}
  }

  // 3. Fallback: Generate clean custom template
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

  // Update role.md to register active skill
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
