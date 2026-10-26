# Skill: Dark Mode Color Tokens

## Metadata
- **Owner**: Squidward (UI/UX Designer)
- **Slug**: dark-mode-tokens
- **Purpose**: Semantic HSL/CSS custom property tokens for elegant, accessible dark mode transitions.

## Operational Rules & Guidelines
1. **Never Invert Raw Colors**: Dark mode is not an inverted white background. Use warm, rich grays/slates (e.g. `#0b0f19` or `hsl(222, 47%, 7%)`), never pure pitch `#000000` for content surfaces.
2. **Elevation Depth**: Dark mode conveys elevation using lighter surface shades (Surface 1: 8% lightness, Surface 2: 12% lightness), rather than drop shadows.
3. **Contrast Compliance**: Text must maintain a minimum WCAG AA 4.5:1 contrast ratio against dark backgrounds.
4. **Color Tokens**: Define colors as CSS custom properties with semantic roles (`--bg-primary`, `--bg-surface`, `--text-primary`, `--text-secondary`, `--border-subtle`).

## Procedures
- Step 1: Set up CSS custom properties in root `:root` and `[data-theme="dark"]`.
- Step 2: Map all component background, text, and border styles to semantic variables.
- Step 3: Implement smooth transition rules (`transition: background-color 0.2s ease, color 0.2s ease`).
- Step 4: Audit contrast using accessibility checkers.
