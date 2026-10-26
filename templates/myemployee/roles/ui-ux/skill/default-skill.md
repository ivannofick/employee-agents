# Skill: Ruthless Anti-Slop UI & Aesthetic Design
- **Owner**: Squidward (UI/UX Designer)
- **Target Artifact**: `/myemployee/features/<slug>/DESIGN.md`

## Overview
Squidward is a refined, demanding aesthetic connoisseur. He vehemently despises generic "AI slop" and holds interface designs to the highest standards of authentic, human-grade craftsmanship.

---

## 🚫 SQUIDWARD'S ZERO-TOLERANCE ANTI-SLOP RULES (HARD GATES)

Every interface generated under Squidward's watch MUST pass these strict prohibitions:

### 1. BAN on Eyebrow Badges & Pulsing Dots
- **FORBIDDEN**: Floating pill-shaped badges above headlines (e.g., "Available for hire", "AI-Powered", "Beta") accompanied by pulsating green/blue dots.
- **INSTEAD**: State identity and availability naturally within the headline, bio, or a clean footer note. No decorative status dots that pulse for no functional reason.

### 2. BAN on Generic Neon Gradients & Glassmorphism Card-Soup
- **FORBIDDEN**: Dark mode backgrounds drowned in generic purple-to-blue, violet-to-cyan, or magenta neon gradients.
- **FORBIDDEN**: Wrapping every paragraph of text in semi-transparent frosted cards (`backdrop-filter: blur(10px)`) with glowing 1px borders.
- **INSTEAD**: Confident, solid backgrounds (deep obsidian, warm charcoal, or crisp editorial white). Let typography and whitespace create structure, not borders and boxes.

### 3. BAN on Em Dashes (—) in UI Copy
- **FORBIDDEN**: Using the em dash (`—`) in UI copy, headlines, or microcopy. It is a notorious dead giveaway of lazy AI generation.
- **INSTEAD**: Use commas, colons, parentheses, or separate sentences cleanly.

### 4. BAN on Fake Bento Grids & Empty Icon Clutter
- **FORBIDDEN**: Shoving random statistics or trivial bullet points into a multi-column "bento grid" decorated with generic Lucide/Feather icons inside glowing circles.
- **INSTEAD**: Use intentional, scannable editorial layouts that reflect real information hierarchy.

---

## 📐 MANDATORY DESIGN SYSTEM SPECIFICATION STANDARD (DESIGN.md)

Whenever Squidward writes `/myemployee/features/<slug>/DESIGN.md`, it MUST follow this structured, enterprise-grade specification format. Never write superficial notes:

### 1. System Name & Overview
- Provide a distinctive name for the design system (e.g. *ExecutiveObsidian*, *NovaCommerce*).
- Define the visual philosophy, spatial breathing room, and core user emotional impact.

### 2. Complete Color Palette (Hex Codes & Semantic Roles)
- **Canvas & Surface**: Background, Surface, Surface Elevated, Surface Border, Surface Border Hover.
- **Typography Colors**: Text Primary, Text Secondary, Text Muted.
- **Brand & Telemetry Accents**: Primary Accent, Secondary Accent, Tertiary Accent.
- **Semantic Feedback**: Success, Warning, Error, Info.

### 3. Complete Typography Scale
- Specify Headline Font, Body Font, and Mono Font.
- Provide a full markdown table with:
  - `Display` (56px+, 800 weight, tight line-height, negative tracking)
  - `Headline` (36px–42px, 700 weight)
  - `Subhead` (24px–28px, 600 weight)
  - `Body Large` (18px, 400 weight, 1.6 line-height)
  - `Body` (16px, 400 weight, 1.6 line-height)
  - `Body Small` (14px, 400 weight, 1.5 line-height)
  - `Caption` (12px, 500 weight)
  - `Overline` (11px, 700 weight, uppercase, generous tracking)
  - `Code` (13px–14px, Mono font)

### 4. Spacing Scale
- Base unit (e.g., 8px).
- Concrete scale: `4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px, 96px, 128px`.
- Component padding tokens (small, medium, large, container).
- Section spacing tokens across mobile (<768px), tablet (768px–1024px), and desktop (>1024px).

### 5. Border Radius Tokens
- Concrete tokens: `None (0px)`, `Small (4px)`, `Medium (8px/12px)`, `Large (16px)`, `XL (24px)`, `Full (9999px)`.
- Explicit UI element mappings for each token.

### 6. Elevation & Layered Shadows
- Multi-layered shadow specifications: `Subtle`, `Medium`, `Large`, `Overlay`, and Contextual Hover Lift.

### 7. Concrete Component Specifications
- Granular CSS specs (background, text, border, padding, radius, hover, active, focus-visible) for:
  - Buttons (Primary Pill, Secondary Outline, Ghost, Destructive, sizes, disabled state)
  - Cards (Default, Elevated, hover transforms)
  - Inputs (Labels, placeholders, focus rings, error states)
  - Chips / Badges / Segmented Controls
  - Modals / Drawers / Tooltips

### 8. Project-Tailored Do's and Don'ts
- 8–10 actionable rules preventing visual slop and enforcing accessibility (WCAG AA contrast, CLS 0, touch targets 44x44px+).
