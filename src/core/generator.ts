import fs from 'fs-extra';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolveAssetRoots } from './downloader.js';
import type { SetupAnswers } from '../cli/prompts.js';

export function renderAgentSkill(activeRoles: string[], templateContent?: string): string {
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

  if (templateContent) {
    return templateContent.replace(
      /## Core Squad Roster[\s\S]*?(?=---)/,
      `## Core Squad Roster\n${rosterLines}\n\n`
    );
  }

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
`;
}

export const START_AGENTS_DELIMITER = '<!-- employee-agents:start -->';
export const END_AGENTS_DELIMITER = '<!-- employee-agents:end -->';

export function renderUniversalAgentsBlock(): string {
  return `${START_AGENTS_DELIMITER}
# Employee-Agents Squad Governance (Universal Ambient Rule)
This workspace is actively governed by the multi-role engineering squad defined in \`/myemployee/\`.
Whenever the user interacts with you (even without slash commands or explicit role mentions):
1. **Identity & Tone**: The user is the founder and CEO. Always address the user as **"Bos"**.
2. **Anti-Slop Hard Rule**: NEVER write or dump application code directly without an active task in \`/myemployee/tasks/in-progress/\` or \`/myemployee/tasks/pending/\`. All files, markdown specs, and code commits MUST be 100% Strict English.
3. **Casual Prompt Triage**: If Bos asks to build, modify, or fix something in chat without typing \`/share-knowledge\` or \`/apply-work\`, Larry (Tech Analyst) and Patrick (PO) immediately greet Bos as front-desk, prepare a pending task ticket in \`/myemployee/tasks/pending/\`, and guide Bos to the next phase instead of dumping unverified code.
4. **Coexistence**: Respect other external agent skills or commands (e.g., OpenSpec \`/opsx-*\`, linters) without interference.
${END_AGENTS_DELIMITER}`;
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

export async function generateWorkspace(answers: SetupAnswers, targetDir: string = process.cwd()): Promise<void> {
  const { templateBase, adapterBase } = await resolveAssetRoots();
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
    version: '1.0.4',
    created_at: new Date().toISOString(),
  };

  await fs.writeJson(configPath, configContent, { spaces: 2 });

  // 4. Install adapter dynamically based on active roles!
  if (answers.targetAi === 'antigravity') {
    const destinationAgentSkill = path.join(targetDir, '.agent', 'skills', 'myemployee', 'SKILL.md');
    await fs.ensureDir(path.dirname(destinationAgentSkill));
    const adapterSkillTemplate = path.join(adapterBase, 'antigravity', 'SKILL.md');
    const templateContent = (await fs.pathExists(adapterSkillTemplate)) ? await fs.readFile(adapterSkillTemplate, 'utf8') : undefined;
    await fs.writeFile(destinationAgentSkill, renderAgentSkill(rolesToInstall, templateContent), 'utf8');

    // Install ambient rules
    const rulesSource = path.join(adapterBase, 'antigravity', 'rules');
    if (await fs.pathExists(rulesSource)) {
      const destinationRules = path.join(targetDir, '.agent', 'rules');
      await fs.ensureDir(destinationRules);
      await fs.copy(rulesSource, destinationRules, { overwrite: true });
    }

    // Install slash command workflows
    const workflowsSource = path.join(adapterBase, 'antigravity', 'workflows');
    if (await fs.pathExists(workflowsSource)) {
      const destinationWorkflows = path.join(targetDir, '.agent', 'workflows');
      await fs.ensureDir(destinationWorkflows);
      await fs.copy(workflowsSource, destinationWorkflows, { overwrite: true });
    }
  }

  // 5. Ensure universal AGENTS.md rule block at target root
  await ensureUniversalAgentsRule(targetDir);
}

export async function updateWorkspace(targetDir: string = process.cwd()): Promise<{ updatedRoles: boolean; updatedAdapter: boolean; updatedWorkflows: boolean; updatedRules: boolean; activeRoles: string[] }> {
  const { templateBase, adapterBase } = await resolveAssetRoots();
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
    const adapterSkillTemplate = path.join(adapterBase, 'antigravity', 'SKILL.md');
    const templateContent = (await fs.pathExists(adapterSkillTemplate)) ? await fs.readFile(adapterSkillTemplate, 'utf8') : undefined;
    await fs.writeFile(destinationAgentSkill, renderAgentSkill(activeRoles, templateContent), 'utf8');

    // Update ambient rules
    const rulesSource = path.join(adapterBase, 'antigravity', 'rules');
    if (await fs.pathExists(rulesSource)) {
      const destinationRules = path.join(targetDir, '.agent', 'rules');
      await fs.ensureDir(destinationRules);
      await fs.copy(rulesSource, destinationRules, { overwrite: true });
    }

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

  // 4. Ensure universal AGENTS.md rule block is updated
  await ensureUniversalAgentsRule(targetDir);

  return { updatedRoles: true, updatedAdapter: true, updatedWorkflows: true, updatedRules: true, activeRoles };
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
  let templateContent: string | undefined;
  if (await fs.pathExists(destinationAgentSkill)) {
    templateContent = await fs.readFile(destinationAgentSkill, 'utf8');
  } else {
    const { adapterBase } = await resolveAssetRoots();
    const adapterSkillTemplate = path.join(adapterBase, 'antigravity', 'SKILL.md');
    if (await fs.pathExists(adapterSkillTemplate)) {
      templateContent = await fs.readFile(adapterSkillTemplate, 'utf8');
    }
  }
  await fs.writeFile(destinationAgentSkill, renderAgentSkill(remainingRoles, templateContent), 'utf8');

  return remainingRoles;
}

export async function addRoleToWorkspace(role: string, targetDir: string = process.cwd()): Promise<string[]> {
  const { templateBase, adapterBase } = await resolveAssetRoots();
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
  let templateContent: string | undefined;
  if (await fs.pathExists(destinationAgentSkill)) {
    templateContent = await fs.readFile(destinationAgentSkill, 'utf8');
  } else {
    const adapterSkillTemplate = path.join(adapterBase, 'antigravity', 'SKILL.md');
    if (await fs.pathExists(adapterSkillTemplate)) {
      templateContent = await fs.readFile(adapterSkillTemplate, 'utf8');
    }
  }
  await fs.writeFile(destinationAgentSkill, renderAgentSkill(activeRoles, templateContent), 'utf8');

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
