import fs from 'fs-extra';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { SetupAnswers } from '../cli/prompts.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function generateWorkspace(answers: SetupAnswers, targetDir: string = process.cwd()): Promise<void> {
  // Find templates and adapters relative to dist or src
  const possibleRoots = [
    path.resolve(__dirname, '..'), // if running from dist
    path.resolve(__dirname, '../..'), // if running from dist/core
    path.resolve(__dirname, '../../..'),
    process.cwd(),
  ];

  let templateBase: string | null = null;
  let adapterBase: string | null = null;

  for (const root of possibleRoots) {
    const tPath = path.join(root, 'templates', 'myemployee');
    const aPath = path.join(root, 'adapters');
    if (await fs.pathExists(tPath)) {
      templateBase = tPath;
      adapterBase = aPath;
      break;
    }
  }

  if (!templateBase || !adapterBase) {
    throw new Error('Unable to locate template and adapter directories.');
  }

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
    version: '1.0.0',
    created_at: new Date().toISOString(),
  };

  await fs.writeJson(configPath, configContent, { spaces: 2 });

  // Install adapter based on selected AI environment
  if (answers.targetAi === 'antigravity') {
    const adapterSource = path.join(adapterBase, 'antigravity', 'SKILL.md');
    const destinationAgentSkill = path.join(targetDir, '.agent', 'skills', 'myemployee', 'SKILL.md');
    await fs.ensureDir(path.dirname(destinationAgentSkill));
    await fs.copy(adapterSource, destinationAgentSkill);
  }
}
