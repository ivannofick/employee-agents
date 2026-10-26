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

  // Install adapter based on selected AI environment
  if (answers.targetAi === 'antigravity') {
    const adapterSource = path.join(adapterBase, 'antigravity', 'SKILL.md');
    const destinationAgentSkill = path.join(targetDir, '.agent', 'skills', 'myemployee', 'SKILL.md');
    await fs.ensureDir(path.dirname(destinationAgentSkill));
    await fs.copy(adapterSource, destinationAgentSkill, { overwrite: true });

    // Install slash command workflows
    const workflowsSource = path.join(adapterBase, 'antigravity', 'workflows');
    if (await fs.pathExists(workflowsSource)) {
      const destinationWorkflows = path.join(targetDir, '.agent', 'workflows');
      await fs.ensureDir(destinationWorkflows);
      await fs.copy(workflowsSource, destinationWorkflows, { overwrite: true });
    }
  }
}

export async function updateWorkspace(targetDir: string = process.cwd()): Promise<{ updatedRoles: boolean; updatedAdapter: boolean; updatedWorkflows: boolean }> {
  const { templateBase, adapterBase } = getAssetRoots();
  const destinationMyEmployee = path.join(targetDir, 'myemployee');

  if (!(await fs.pathExists(destinationMyEmployee))) {
    throw new Error('No existing /myemployee workspace found to update. Run init first.');
  }

  // 1. Update roles with overwrite: true (preserves PRD.md, features/, tasks/)
  const rolesSource = path.join(templateBase, 'roles');
  const rolesDest = path.join(destinationMyEmployee, 'roles');
  if (await fs.pathExists(rolesSource)) {
    await fs.copy(rolesSource, rolesDest, { overwrite: true });
  }

  // 2. Read existing config to know target AI
  let targetAi = 'antigravity';
  const configPath = path.join(destinationMyEmployee, 'config.json');
  if (await fs.pathExists(configPath)) {
    try {
      const config = await fs.readJson(configPath);
      if (config.target_ai) targetAi = config.target_ai;
    } catch {}
  }

  // 3. Update adapter & workflows for Antigravity
  if (targetAi === 'antigravity') {
    const adapterSource = path.join(adapterBase, 'antigravity', 'SKILL.md');
    const destinationAgentSkill = path.join(targetDir, '.agent', 'skills', 'myemployee', 'SKILL.md');
    await fs.ensureDir(path.dirname(destinationAgentSkill));
    await fs.copy(adapterSource, destinationAgentSkill, { overwrite: true });

    const workflowsSource = path.join(adapterBase, 'antigravity', 'workflows');
    if (await fs.pathExists(workflowsSource)) {
      const destinationWorkflows = path.join(targetDir, '.agent', 'workflows');
      await fs.ensureDir(destinationWorkflows);
      await fs.copy(workflowsSource, destinationWorkflows, { overwrite: true });
    }
  }

  return { updatedRoles: true, updatedAdapter: true, updatedWorkflows: true };
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
