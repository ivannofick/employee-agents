# Skill: Tailwind Design System Tokens

## Metadata
- **Owner**: Squidward (UI/UX Designer)
- **Slug**: tailwind-system
- **Purpose**: Strict Tailwind configuration with curated brand colors, typography scales, and anti-slop rules.

## Operational Rules & Guidelines
1. **Extend, Don't Override Essentials**: Extend Tailwind theme colors and spacing scales rather than breaking standard utilities.
2. **Ban Generic Neon Gradients**: Prohibit `from-purple-500 to-cyan-500` AI-cliché gradients. Use single rich accent colors or subtle tone shifts.
3. **No Arbitrary Value Soup**: Avoid unmaintainable arbitrary brackets like `w-[327px]` or `bg-[#1a2b3c]`. Bind values to tokens in `tailwind.config.js`.
4. **Interactive States**: Every clickable element must have explicit `:hover`, `:focus-visible`, and `:active` styling.

## Procedures
- Step 1: Configure `tailwind.config.js` with semantic color palette and font family stack.
- Step 2: Establish component utility patterns with clean class grouping.
- Step 3: Verify zero usage of uncurated gradient soup or unreadable contrast.
