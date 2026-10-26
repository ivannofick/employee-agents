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
  updater: {
    title: 'UPDATER EMPLOYEE-AGENTS',
    starting: 'Memperbarui roles, skills, dan slash commands ke versi terbaru...',
    successMessage: 'Berhasil memperbarui roles, skills, dan slash commands!',
    safeNote: 'PRD.md, features/, tasks/, dan config.json kustom Anda tetap aman terjaga.',
    outro: 'Squad Anda sudah versi terbaru, Bos!',
    detectedPrompt: 'Workspace /myemployee yang sudah ada terdeteksi. Apa yang ingin Anda lakukan?',
    optionUpdate: '1) Update roles, skills & slash commands (Aman, menjaga PRD dan task kustom Anda)',
    optionReinit: '2) Jalankan ulang setup wizard dari awal',
  },
};
