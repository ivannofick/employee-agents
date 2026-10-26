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

  // Copy template files non-destructively
  await fs.copy(templateBase, destinationMyEmployee, {
    overwrite: false,
    errorOnExist: false,
  });

  // Write custom config.json
  const configPath = path.join(destinationMyEmployee, 'config.json');
  const configContent = {
    name: answers.projectName,
    project_type: answers.projectType,
    target_ai: answers.targetAi,
    language: answers.language,
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
