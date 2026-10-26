import * as p from '@clack/prompts';
import pc from 'picocolors';
import path from 'node:path';
import { getDictionary } from '../i18n/index.js';

export interface SetupAnswers {
  targetAi: string;
  projectType: 'new' | 'existing';
  projectName: string;
  roles: string[];
  language: string;
}

export const ALL_ROLES = [
  'product-owner',
  'ui-ux',
  'tech-lead',
  'project-manager',
  'developer',
  'qa',
] as const;

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

  // Squad Role Selection: All vs Custom
  const squadMode = await p.select({
    message: dict.wizard.selectSquadMode,
    options: [
      { value: 'all', label: dict.wizard.squadModeOptions.all },
      { value: 'custom', label: dict.wizard.squadModeOptions.custom },
    ],
  });

  if (p.isCancel(squadMode)) {
    p.cancel('Setup cancelled.');
    process.exit(0);
  }

  let selectedRoles: string[] = [...ALL_ROLES];

  if (squadMode === 'custom') {
    const customChoices = await p.multiselect({
      message: dict.wizard.selectRolesPrompt,
      options: [
        { value: 'product-owner', label: dict.wizard.roleOptions['product-owner'] },
        { value: 'ui-ux', label: dict.wizard.roleOptions['ui-ux'] },
        { value: 'tech-lead', label: dict.wizard.roleOptions['tech-lead'] },
        { value: 'project-manager', label: dict.wizard.roleOptions['project-manager'] },
        { value: 'developer', label: dict.wizard.roleOptions['developer'] },
        { value: 'qa', label: dict.wizard.roleOptions['qa'] },
      ],
      required: true,
    });

    if (p.isCancel(customChoices)) {
      p.cancel('Setup cancelled.');
      process.exit(0);
    }

    selectedRoles = customChoices as string[];
  }

  return {
    targetAi: targetAi as string,
    projectType: projectType as 'new' | 'existing',
    projectName: projectName as string,
    roles: selectedRoles,
    language: lang,
  };
}
