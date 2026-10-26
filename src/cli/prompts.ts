import * as p from '@clack/prompts';
import pc from 'picocolors';
import path from 'node:path';
import { getDictionary } from '../i18n/index.js';

export interface SetupAnswers {
  targetAi: string;
  projectType: 'new' | 'existing';
  projectName: string;
  language: string;
}

export async function runSetupWizard(lang: string = 'en'): Promise<SetupAnswers> {
  const dict = getDictionary(lang);
  const defaultProjectName = path.basename(process.cwd()) || 'my-app';

  p.intro(pc.bgCyan(pc.black(` 🏢 ${dict.banner.title} `)));
  p.note(dict.banner.subtitle, 'Framework Info');

  const targetAi = await p.select({
    message: dict.wizard.selectAi,
    options: [
      { value: 'antigravity', label: dict.wizard.aiOptions.antigravity },
      { value: 'cursor', label: dict.wizard.aiOptions.cursor },
      { value: 'claude', label: dict.wizard.aiOptions.claude },
      { value: 'cline', label: dict.wizard.aiOptions.cline },
      { value: 'windsurf', label: dict.wizard.aiOptions.windsurf },
    ],
  });

  if (p.isCancel(targetAi)) {
    p.cancel('Setup cancelled.');
    process.exit(0);
  }

  const projectType = await p.select({
    message: dict.wizard.selectProjectType,
    options: [
      { value: 'new', label: dict.wizard.projectTypeOptions.new },
      { value: 'existing', label: dict.wizard.projectTypeOptions.existing },
    ],
  });

  if (p.isCancel(projectType)) {
    p.cancel('Setup cancelled.');
    process.exit(0);
  }

  const projectName = await p.text({
    message: dict.wizard.projectNamePrompt,
    placeholder: defaultProjectName,
    defaultValue: defaultProjectName,
  });

  if (p.isCancel(projectName)) {
    p.cancel('Setup cancelled.');
    process.exit(0);
  }

  return {
    targetAi: targetAi as string,
    projectType: projectType as 'new' | 'existing',
    projectName: projectName as string,
    language: lang,
  };
}
