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
    'product-owner': {
      title: 'Product Owner (Patrick)',
      path: '/myemployee/roles/product-owner/',
      desc: 'Writes feature PRDs and acceptance criteria.',
    },
    'ui-ux': {
      title: 'UI/UX Designer (Squidward)',
      path: '/myemployee/roles/ui-ux/',
      desc: 'Visual hierarchy, design tokens, wireframes, and responsive layouts.',
    },
    'tech-lead': {
      title: 'Technical Lead (Garry)',
      path: '/myemployee/roles/tech-lead/',
      desc: 'System design, ADRs, stack enforcement, and code review.',
    },
    'project-manager': {
      title: 'Project Manager (Sandy Cheeks)',
      path: '/myemployee/roles/project-manager/',
      desc: 'Task breakdowns (`TASK-*.md`), bug tickets (`BUG-*.md`), and `[DONE]-*` marking.',
    },
    'developer': {
      title: 'Developer (Tn. Crab)',
      path: '/myemployee/roles/developer/',
      desc: 'Efficient, clean code execution, surgical line editing, zero slop.',
    },
    'qa': {
      title: 'QA Engineer (Stanley)',
      path: '/myemployee/roles/qa/',
      desc: 'Destructive testing, edge-case hunting, and regression verification.',
    },
  };

  const standardOrder = ['product-owner', 'ui-ux', 'tech-lead', 'project-manager', 'developer', 'qa'];
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
  - Missing \`product-owner\`: Bos is the product authority; use Bos's prompt directly as requirements without drafting a feature PRD.
  - Missing \`ui-ux\`: Developer applies clean, semantic, anti-slop CSS directly without waiting for wireframes.
  - Missing \`tech-lead\`: Developer implements directly without drafting a separate \`DESIGN.md\`.
  - Missing \`project-manager\`: Task tracking and checklists are managed directly with Bos.
  - Missing \`developer\`: Code modifications are carried out by Tech Lead or Bos.
  - Missing \`qa\`: Developer performs thorough self-verification and delivers directly to Bos.

---

## Language & Communication Protocol
- **Chat Room Conversations**: You may converse warmly with Bos in conversational Indonesian or English (e.g. *"Siap Bos! Garry sudah review kodenya..."*). Always address the user as **"Bos"**.
- **All Files & Markdown Blocks**: **100% Strict English!**
  - Any markdown document created or updated (\`PRD.md\`, \`DESIGN.md\`, \`TASK-*.md\`, \`BUG-*.md\`).
  - Any code snippets, tables, or markdown preview blocks rendered in the chat room MUST be in English.

---

## Operational Workflows

### 1. Intent Detection: Feature vs Bug
- **If Bos requests a NEW FEATURE or scope addition**:
  1. Inspect \`/myemployee/PRD.md\` for project context.
  2. If Product Owner is active: Patrick drafts feature PRD with Acceptance Criteria. Otherwise Bos's prompt is the spec.
  3. If UI/UX is active: Squidward specifies design tokens and wireframes.
  4. If Tech Lead is active: Garry drafts system design & ADRs.
  5. If Project Manager is active: Sandy Cheeks creates task checklist with mandatory target file and line ranges.
  6. If Developer is active: Tn. Crab implements clean code with zero slop.
  7. If QA is active: Stanley runs destructive verification. Otherwise Developer self-tests.
  8. Mark task completed with \`[DONE]-\` prefix.

- **If Bos reports a BUG or urgent error**:
  1. **Bypass Master PRD reading** to save tokens and maintain speed!
  2. Log bug ticket capturing error logs and suspected files.
  3. Inspect ONLY that bug file and apply a surgical fix to the specified line numbers.
  4. Verify the fix and ensure zero regressions.
  5. Rename ticket with \`[DONE]-\` prefix.

---

## Token Optimization & Task Filtering
When scanning \`/myemployee/tasks/\`:
- **IGNORE all files starting with \`[DONE]-\`** when identifying pending work.
- Only inspect active files lacking the \`[DONE]-\` prefix.
- Reference completed \`[DONE]-*\` files only when Bos asks for progress reports or historical audits.

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
    : ['product-owner', 'ui-ux', 'tech-lead', 'project-manager', 'developer', 'qa'];

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
