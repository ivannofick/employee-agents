#!/usr/bin/env node

import { Command } from 'commander';
import * as p from '@clack/prompts';
import pc from 'picocolors';
import fs from 'fs-extra';
import path from 'node:path';
import { runSetupWizard } from './cli/prompts.js';
import {
  generateWorkspace,
  updateWorkspace,
  addSkillToRole,
  getSkillCatalog,
  addRoleToWorkspace,
  removeRoleFromWorkspace,
} from './core/generator.js';
import { getDictionary } from './i18n/index.js';

async function handleAddRole(roleArg?: string, options?: { lang?: string }) {
  try {
    p.intro(pc.cyan('employee-agents: add-role'));
    const rolesDir = path.join(process.cwd(), 'myemployee', 'roles');
    const existing = (await fs.pathExists(rolesDir))
      ? (await fs.readdir(rolesDir)).filter((r) => !r.startsWith('.'))
      : [];

    const available = [
      'product-owner',
      'ui-ux',
      'tech-lead',
      'project-manager',
      'developer',
      'qa',
    ].filter((r) => !existing.includes(r));

    if (available.length === 0) {
      p.note('All 6 roles are already active in your squad.', 'Squad Full');
      p.outro(pc.green('All roles are active.'));
      return;
    }

    let role = roleArg;
    if (!role) {
      const selected = await p.select({
        message: 'Select a role to add to your squad:',
        options: available.map((r) => ({ value: r, label: r })),
      });
      if (p.isCancel(selected)) {
        p.cancel('Cancelled.');
        process.exit(0);
      }
      role = selected as string;
    }

    const s = p.spinner();
    s.start(`Activating role "${role}" in squad...`);
    const activeRoles = await addRoleToWorkspace(role, process.cwd());
    s.stop(pc.green(`✔ Activated role "${role}" successfully!`));
    p.note(`Active Squad: ${activeRoles.join(', ')}\nController .agent/skills/myemployee/SKILL.md is updated.`, 'Squad Updated');
    p.outro(pc.green('Squad updated successfully.'));
  } catch (err: any) {
    p.cancel(pc.red(`Failed to add role: ${err.message}`));
    process.exit(1);
  }
}

async function handleRemoveRole(roleArg?: string, options?: { lang?: string }) {
  try {
    p.intro(pc.cyan('employee-agents: remove-role'));
    const rolesDir = path.join(process.cwd(), 'myemployee', 'roles');
    const existing = (await fs.pathExists(rolesDir))
      ? (await fs.readdir(rolesDir)).filter((r) => !r.startsWith('.'))
      : [];

    if (existing.length === 0) {
      p.note('No roles currently exist in your workspace.', 'Empty Squad');
      p.outro(pc.yellow('No roles available to remove.'));
      return;
    }

    let role = roleArg;
    if (!role) {
      const selected = await p.select({
        message: 'Select a role to deactivate from your squad:',
        options: existing.map((r) => ({ value: r, label: r })),
      });
      if (p.isCancel(selected)) {
        p.cancel('Cancelled.');
        process.exit(0);
      }
      role = selected as string;
    }

    const s = p.spinner();
    s.start(`Deactivating role "${role}" from squad...`);
    const remaining = await removeRoleFromWorkspace(role, process.cwd());
    s.stop(pc.green(`✔ Role "${role}" removed successfully!`));
    p.note(`Remaining Squad: ${remaining.join(', ')}\nController .agent/skills/myemployee/SKILL.md is updated and self-healed.`, 'Squad Updated');
    p.outro(pc.green('Role removed successfully.'));
  } catch (err: any) {
    p.cancel(pc.red(`Failed to remove role: ${err.message}`));
    process.exit(1);
  }
}

async function handleAddSkill(roleArg?: string, skillArg?: string, options?: { lang?: string }) {
  try {
    const lang = options?.lang || 'en';
    const dict = getDictionary(lang);

    p.intro(pc.cyan(dict.skillAdder.title));

    let role = roleArg;
    if (!role) {
      const selected = await p.select({
        message: dict.skillAdder.selectRole,
        options: [
          { value: 'product-owner', label: 'product-owner (Patrick)' },
          { value: 'ui-ux', label: 'ui-ux (Squidward)' },
          { value: 'tech-lead', label: 'tech-lead (Garry)' },
          { value: 'project-manager', label: 'project-manager (Sandy Cheeks)' },
          { value: 'developer', label: 'developer (Tn. Crab)' },
          { value: 'qa', label: 'qa (Stanley)' },
        ],
      });
      if (p.isCancel(selected)) {
        p.cancel('Cancelled.');
        process.exit(0);
      }
      role = selected as string;
    }

    let skillSlug = skillArg;
    let description = '';

    if (!skillSlug) {
      const catalog = await getSkillCatalog(role);
      const catalogOptions = catalog.map((item) => ({
        value: item.slug,
        label: `${item.name} (${item.slug}) - ${item.description}`,
      }));

      catalogOptions.push({
        value: '__custom__',
        label: 'Custom (Define your own custom skill)',
      });

      const skillChoice = await p.select({
        message: `Select a skill from catalog or create custom for ${role}:`,
        options: catalogOptions,
      });

      if (p.isCancel(skillChoice)) {
        p.cancel('Cancelled.');
        process.exit(0);
      }

      if (skillChoice === '__custom__') {
        const entered = await p.text({
          message: dict.skillAdder.skillNamePrompt,
          placeholder: 'docker-setup',
          validate: (val) => (!val || !val.trim() ? 'Skill name is required' : undefined),
        });
        if (p.isCancel(entered)) {
          p.cancel('Cancelled.');
          process.exit(0);
        }
        skillSlug = entered as string;

        const desc = await p.text({
          message: dict.skillAdder.skillDescPrompt,
          placeholder: 'Defines guidelines and execution procedures',
        });
        if (p.isCancel(desc)) {
          p.cancel('Cancelled.');
          process.exit(0);
        }
        description = (desc as string) || '';
      } else {
        skillSlug = skillChoice as string;
        const found = catalog.find((c) => c.slug === skillSlug);
        description = found ? found.description : '';
      }
    }

    const s = p.spinner();
    s.start(`Adding skill "${skillSlug}" to ${role}...`);

    const filePath = await addSkillToRole(role, skillSlug, (description as string) || '');
    s.stop(pc.green(`✔ ${dict.skillAdder.success} ${role}!`));
    p.note(`Created: ${filePath}\nUpdated: /myemployee/roles/${role}/role.md`, 'Skill Registered');
    p.outro(pc.green('Skill registered successfully.'));
  } catch (err: any) {
    p.cancel(pc.red(`Failed to add skill: ${err.message}`));
    process.exit(1);
  }
}

async function handleUpdate(options?: { lang?: string }) {
  try {
    const lang = options?.lang || 'en';
    const dict = getDictionary(lang);

    p.intro(pc.cyan(dict.updater.title));

    const s = p.spinner();
    s.start(dict.updater.starting);

    await updateWorkspace(process.cwd());

    s.stop(pc.green(`✔ ${dict.updater.successMessage}`));
    p.note(dict.updater.safeNote, 'Safe Update');
    p.outro(pc.green(dict.updater.outro));
  } catch (err: any) {
    p.cancel(pc.red(`Update failed: ${err.message}`));
    process.exit(1);
  }
}

async function handleInit(options: { lang?: string }) {
  try {
    const lang = options.lang || 'en';
    const dict = getDictionary(lang);

    // If an existing workspace is detected, offer to update or re-init
    const existingMyEmployee = path.join(process.cwd(), 'myemployee');
    if (await fs.pathExists(existingMyEmployee)) {
      p.intro(pc.cyan(dict.banner.title));
      const choice = await p.select({
        message: dict.updater.detectedPrompt,
        options: [
          { value: 'update', label: dict.updater.optionUpdate },
          { value: 'reinit', label: dict.updater.optionReinit },
        ],
      });

      if (p.isCancel(choice)) {
        p.cancel('Cancelled.');
        process.exit(0);
      }

      if (choice === 'update') {
        const s = p.spinner();
        s.start(dict.updater.starting);
        await updateWorkspace(process.cwd());
        s.stop(pc.green(`✔ ${dict.updater.successMessage}`));
        p.note(dict.updater.safeNote, 'Safe Update');
        p.outro(pc.green(dict.updater.outro));
        return;
      }
    }

    const answers = await runSetupWizard(lang);

    const s = p.spinner();
    s.start('Scaffolding /myemployee workspace and adapter...');

    await generateWorkspace(answers);

    s.stop(pc.green(`✔ ${dict.wizard.successMessage}`));
    p.outro(pc.green(dict.wizard.nextSteps));
  } catch (err: any) {
    p.cancel(pc.red(`Initialization failed: ${err.message}`));
    process.exit(1);
  }
}

const program = new Command();

program
  .name('employee-agents')
  .description('Virtual multi-role engineering squad adapting native spec-driven workflows')
  .version('1.0.4')
  .addHelpCommand('help [command]', 'Display help for employee-agents commands')
  .option('-l, --lang <language>', 'Language for CLI wizard (en | id)', 'en')
  .action(async (options) => {
    await handleInit(options);
  });

program
  .command('init')
  .description('Initialize employee-agents in the current workspace')
  .option('-l, --lang <language>', 'Language for CLI wizard (en | id)', 'en')
  .action(async (options) => {
    await handleInit(options);
  });

program
  .command('update-me')
  .description('Update roles, skills, and slash commands in an existing /myemployee workspace')
  .option('-l, --lang <language>', 'Language for updater (en | id)', 'en')
  .action(async (options) => {
    await handleUpdate(options);
  });

program
  .command('update')
  .description('Update roles, skills, and slash commands in an existing /myemployee workspace (alias for update-me)')
  .option('-l, --lang <language>', 'Language for updater (en | id)', 'en')
  .action(async (options) => {
    await handleUpdate(options);
  });

program
  .command('add-skill [role] [skill-name]')
  .description('Add a new modular skill to an employee role')
  .option('-l, --lang <language>', 'Language for prompt (en | id)', 'en')
  .action(async (role, skillName, options) => {
    await handleAddSkill(role, skillName, options);
  });

program
  .command('add-role [role]')
  .description('Add a new employee role to the squad')
  .option('-l, --lang <language>', 'Language for prompt (en | id)', 'en')
  .action(async (role, options) => {
    await handleAddRole(role, options);
  });

program
  .command('remove-role [role]')
  .description('Remove an employee role from the squad')
  .option('-l, --lang <language>', 'Language for prompt (en | id)', 'en')
  .action(async (role, options) => {
    await handleRemoveRole(role, options);
  });

program.parse(process.argv);
