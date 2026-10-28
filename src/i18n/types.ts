export interface LocaleDictionary {
  banner: {
    title: string;
    subtitle: string;
  };
  wizard: {
    selectAi: string;
    aiOptions: {
      antigravity: string;
      cursor: string;
      claude: string;
      cline: string;
      windsurf: string;
    };
    selectProjectType: string;
    projectTypeOptions: {
      new: string;
      existing: string;
    };
    projectNamePrompt: string;
    projectNameDefault: string;
    selectSquadMode: string;
    squadModeOptions: {
      all: string;
      custom: string;
    };
    selectRolesPrompt: string;
    roleOptions: {
      'tech-analyst': string;
      'product-owner': string;
      'ui-ux': string;
      'tech-lead': string;
      'project-manager': string;
      'developer': string;
      'qa': string;
    };
    successMessage: string;
    gitProtection: string;
    nextSteps: string;
  };
  updater: {
    title: string;
    starting: string;
    successMessage: string;
    safeNote: string;
    outro: string;
    detectedPrompt: string;
    optionUpdate: string;
    optionReinit: string;
  };
  skillAdder: {
    title: string;
    selectRole: string;
    skillNamePrompt: string;
    skillDescPrompt: string;
    success: string;
  };
}
