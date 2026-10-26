#!/usr/bin/env node

import { Command } from 'commander';
import * as p from '@clack/prompts';
import pc from 'picocolors';
import fs from 'fs-extra';
import path from 'node:path';
import { runSetupWizard } from './cli/prompts.js';
import { generateWorkspace, updateWorkspace } from './core/generator.js';
import { getDictionary } from './i18n/index.js';

async function handleUpdate(options?: { lang?: string }) {
  try {
    const lang = options?.lang || 'en';
    const dict = getDictionary(lang);

    p.intro(pc.bgCyan(pc.black(` 🔄 ${dict.updater.title} `)));

    const s = p.spinner();
    s.start(dict.updater.starting);

    await updateWorkspace(process.cwd());

    s.stop(pc.green(`✔ ${dict.updater.successMessage}`));
    p.note(dict.updater.safeNote, 'Safe Update');
    p.outro(pc.cyan(`💬 ${dict.updater.outro}`));
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
      p.intro(pc.bgCyan(pc.black(` 🏢 ${dict.banner.title} `)));
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
        p.outro(pc.cyan(`💬 ${dict.updater.outro}`));
        return;
      }
    }

    const answers = await runSetupWizard(lang);

    const s = p.spinner();
    s.start('Scaffolding /myemployee workspace and adapter...');

    await generateWorkspace(answers);

    s.stop(pc.green(`✔ ${dict.wizard.successMessage}`));
    p.outro(pc.cyan(`💬 ${dict.wizard.nextSteps}`));
  } catch (err: any) {
    p.cancel(pc.red(`Initialization failed: ${err.message}`));
    process.exit(1);
  }
}

const program = new Command();

program
  .name('employee-agents')
  .description('Virtual multi-role engineering squad adapting native spec-driven workflows')
  .version('1.0.1')
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
  .command('update')
  .description('Update roles, skills, and slash commands in an existing /myemployee workspace')
  .option('-l, --lang <language>', 'Language for updater (en | id)', 'en')
  .action(async (options) => {
    await handleUpdate(options);
  });

program.parse(process.argv);
