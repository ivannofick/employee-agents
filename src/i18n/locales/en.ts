import type { LocaleDictionary } from '../types.js';

export const en: LocaleDictionary = {
  banner: {
    title: 'employee-agents',
    subtitle: 'Virtual multi-role engineering squad with native spec-driven workflows',
  },
  wizard: {
    selectAi: 'Select your target AI Environment:',
    aiOptions: {
      antigravity: 'Antigravity (Google / AGY)',
      cursor: 'Cursor IDE (Coming Soon)',
      claude: 'Claude Code (Coming Soon)',
      cline: 'Cline / Roo Code (Coming Soon)',
      windsurf: 'Windsurf (Coming Soon)',
    },
    selectProjectType: 'Is this a new project or an existing codebase?',
    projectTypeOptions: {
      new: 'New Project (Start from scratch / Greenfield)',
      existing: 'Existing Codebase (Brownfield application)',
    },
    projectNamePrompt: 'Enter your project name:',
    projectNameDefault: 'my-app',
    selectSquadMode: 'How would you like to assemble your squad?',
    squadModeOptions: {
      all: 'All Roles (Activate all 6 roles: PO, UI/UX, Tech Lead, PM, Dev, QA)',
      custom: 'Custom (Select specific roles)',
    },
    selectRolesPrompt: 'Select squad roles to activate:',
    roleOptions: {
      'product-owner': 'product-owner (Patrick - Specs & User Stories)',
      'ui-ux': 'ui-ux (Squidward - Anti-Slop UI & Wireframes)',
      'tech-lead': 'tech-lead (Garry - Architecture & ADRs)',
      'project-manager': 'project-manager (Sandy Cheeks - PM & Bug Tracking)',
      'developer': 'developer (Tn. Crab - Clean Code Execution)',
      'qa': 'qa (Stanley - Destructive Testing & Edge Cases)',
    },
    successMessage: 'Successfully initialized /myemployee workspace!',
    nextSteps: 'Workspace initialized. Open your AI assistant chat to begin.',
  },
  updater: {
    title: 'employee-agents: update-me',
    starting: 'Updating roles, skills, and slash commands to latest version...',
    successMessage: 'Successfully updated roles, skills, and slash commands!',
    safeNote: 'Your custom PRD.md, features/, tasks/, and config.json were safely preserved.',
    outro: 'Workspace is up to date.',
    detectedPrompt: 'Existing /myemployee workspace detected. What would you like to do?',
    optionUpdate: '1) Update roles, skills & slash commands (Safely preserves your PRDs and tasks)',
    optionReinit: '2) Re-run full setup wizard from scratch',
  },
  skillAdder: {
    title: 'employee-agents: add-skill',
    selectRole: 'Select the role receiving the new skill:',
    skillNamePrompt: 'Enter skill name (slug format, e.g. docker-setup, mobile-layout):',
    skillDescPrompt: 'Enter a brief description of the skill capability:',
    success: 'Successfully added new skill to',
  },
};
