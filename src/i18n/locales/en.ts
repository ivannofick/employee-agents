import type { LocaleDictionary } from '../types.js';

export const en: LocaleDictionary = {
  banner: {
    title: 'EMPLOYEE-AGENTS SETUP WIZARD',
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
    successMessage: 'Successfully initialized /myemployee workspace!',
    nextSteps: 'Your squad is ready, Bos! Open your AI assistant chat to begin.',
  },
  updater: {
    title: 'EMPLOYEE-AGENTS UPDATER',
    starting: 'Updating roles, skills, and slash commands to latest version...',
    successMessage: 'Successfully updated roles, skills, and slash commands!',
    safeNote: 'Your custom PRD.md, features/, tasks/, and config.json were safely preserved.',
    outro: 'Your squad is up-to-date, Bos!',
    detectedPrompt: 'Existing /myemployee workspace detected. What would you like to do?',
    optionUpdate: '1) Update roles, skills & slash commands (Safely preserves your PRDs and tasks)',
    optionReinit: '2) Re-run full setup wizard from scratch',
  },
};
