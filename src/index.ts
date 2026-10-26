#!/usr/bin/env node

import { Command } from 'commander';
import * as p from '@clack/prompts';
import pc from 'picocolors';
import { runSetupWizard } from './cli/prompts.js';
import { generateWorkspace } from './core/generator.js';
import { getDictionary } from './i18n/index.js';

async function handleInit(options: { lang?: string }) {
  try {
    const lang = options.lang || 'en';
    const dict = getDictionary(lang);
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
  .version('1.0.0')
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

program.parse(process.argv);
