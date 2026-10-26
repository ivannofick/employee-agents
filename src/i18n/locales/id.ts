import type { LocaleDictionary } from '../types.js';

export const id: LocaleDictionary = {
  banner: {
    title: 'SETUP WIZARD EMPLOYEE-AGENTS',
    subtitle: 'Virtual squad rekayasa perangkat lunak dengan workflow spec-driven native',
  },
  wizard: {
    selectAi: 'Pilih AI Environment yang ingin Anda gunakan:',
    aiOptions: {
      antigravity: 'Antigravity (Google / AGY)',
      cursor: 'Cursor IDE (Coming Soon)',
      claude: 'Claude Code (Coming Soon)',
      cline: 'Cline / Roo Code (Coming Soon)',
      windsurf: 'Windsurf (Coming Soon)',
    },
    selectProjectType: 'Apakah ini project baru atau project yang sudah ada?',
    projectTypeOptions: {
      new: 'Proyek Baru (Mulai dari nol / Greenfield)',
      existing: 'Proyek yang Sudah Ada (Existing Codebase / Brownfield)',
    },
    projectNamePrompt: 'Masukkan nama proyek Anda:',
    projectNameDefault: 'my-app',
    successMessage: 'Berhasil menginisialisasi workspace /myemployee!',
    nextSteps: 'Squad siap tempur, Bos! Buka chat AI assistant Anda untuk memulai.',
  },
};
