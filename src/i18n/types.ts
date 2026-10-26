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
    successMessage: string;
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
}
