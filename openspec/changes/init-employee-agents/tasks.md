## 1. Project Initialization & Tooling

- [x] 1.1 Create `package.json` with ESM configuration, scripts, and dependencies.
- [x] 1.2 Create `tsconfig.json` targeting NodeNext / ESNext.
- [x] 1.3 Create `.gitignore` to protect node_modules and dist artifacts.

## 2. i18n Translation Subsystem

- [x] 2.1 Create `src/i18n/types.ts` defining locale dictionary schema.
- [x] 2.2 Create `src/i18n/locales/en.ts` for English CLI dictionary.
- [x] 2.3 Create `src/i18n/locales/id.ts` for Indonesian CLI dictionary.
- [x] 2.4 Create `src/i18n/index.ts` translation helper.

## 3. Universal Company Blueprints (Templates)

- [x] 3.1 Create `templates/myemployee/PRD.md` supporting Greenfield and Brownfield context.
- [x] 3.2 Create `templates/myemployee/config.json`.
- [x] 3.3 Create `templates/myemployee/roles/product-owner/` (`role.md` & `skill/default-skill.md`).
- [x] 3.4 Create `templates/myemployee/roles/ui-ux/` (`role.md` & `skill/default-skill.md`).
- [x] 3.5 Create `templates/myemployee/roles/tech-lead/` (`role.md` & `skill/default-skill.md`).
- [x] 3.6 Create `templates/myemployee/roles/project-manager/` (`role.md` & `skill/default-skill.md`).
- [x] 3.7 Create `templates/myemployee/roles/developer/` (`role.md` & `skill/default-skill.md`).
- [x] 3.8 Create `templates/myemployee/roles/qa/` (`role.md` & `skill/default-skill.md`).

## 4. Antigravity Adapter

- [x] 4.1 Create `adapters/antigravity/SKILL.md` driver template.

## 5. CLI Setup Engine & Generator

- [x] 5.1 Create `src/cli/prompts.ts` for 3-step interactive onboarding with `--lang id` detection.
- [x] 5.2 Create `src/core/generator.ts` to scaffold `/myemployee/` and install adapter.
- [x] 5.3 Create `src/index.ts` CLI entrypoint.

## 6. Verification & Build

- [x] 6.1 Install dependencies and build project via `npm run build`.
- [x] 6.2 Test interactive init execution and verify output directory structure.
