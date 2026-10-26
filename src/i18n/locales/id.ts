import type { LocaleDictionary } from '../types.js';

export const id: LocaleDictionary = {
  banner: {
    title: 'employee-agents',
    subtitle: 'Virtual multi-role engineering squad dengan workflow spec-driven native',
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
    selectSquadMode: 'Bagaimana Anda ingin menyusun squad?',
    squadModeOptions: {
      all: 'Semua Role (Aktifkan seluruh 6 role: PO, UI/UX, Tech Lead, PM, Dev, QA)',
      custom: 'Kustom (Pilih role tertentu)',
    },
    selectRolesPrompt: 'Pilih squad roles yang ingin diaktifkan:',
    roleOptions: {
      'product-owner': 'product-owner (Patrick - Specs & User Stories)',
      'ui-ux': 'ui-ux (Squidward - Anti-Slop UI & Wireframes)',
      'tech-lead': 'tech-lead (Garry - Architecture & ADRs)',
      'project-manager': 'project-manager (Sandy Cheeks - PM & Bug Tracking)',
      'developer': 'developer (Tn. Crab - Clean Code Execution)',
      'qa': 'qa (Stanley - Destructive Testing & Edge Cases)',
    },
    successMessage: 'Berhasil menginisialisasi workspace /myemployee!',
    nextSteps: 'Workspace berhasil diinisialisasi. Buka sesi AI assistant Anda untuk memulai.',
  },
  updater: {
    title: 'employee-agents: update',
    starting: 'Memperbarui roles, skills, dan slash commands ke versi terbaru...',
    successMessage: 'Berhasil memperbarui roles, skills, dan slash commands!',
    safeNote: 'PRD.md, features/, tasks/, dan config.json kustom Anda tetap aman terjaga.',
    outro: 'Workspace berhasil diperbarui ke versi terbaru.',
    detectedPrompt: 'Workspace /myemployee yang sudah ada terdeteksi. Apa yang ingin Anda lakukan?',
    optionUpdate: '1) Update roles, skills & slash commands (Aman, menjaga PRD dan task kustom Anda)',
    optionReinit: '2) Jalankan ulang setup wizard dari awal',
  },
  skillAdder: {
    title: 'employee-agents: add-skill',
    selectRole: 'Pilih role yang akan menerima skill baru:',
    skillNamePrompt: 'Masukkan nama skill (format slug, contoh: docker-setup, mobile-layout):',
    skillDescPrompt: 'Masukkan deskripsi singkat kapabilitas skill:',
    success: 'Berhasil menambahkan skill baru ke',
  },
};
