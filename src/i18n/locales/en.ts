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
};
