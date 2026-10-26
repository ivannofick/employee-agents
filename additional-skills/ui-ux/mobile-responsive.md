# Skill: Mobile-First Responsive Layouts

## Metadata
- **Owner**: Squidward (UI/UX Designer)
- **Slug**: mobile-responsive
- **Purpose**: Mobile-first viewport reflows, fluid clamp() typography, and accessible touch targets without horizontal overflow.

## Operational Rules & Guidelines
1. **Never Break Viewport Width**: Zero tolerance for horizontal scrolling on mobile (check `overflow-x: hidden` and width bounds).
2. **Fluid Typography**: Use `clamp()` for fluid headings instead of jarring breakpoint jumps:
   `font-size: clamp(1.5rem, 4vw + 1rem, 2.75rem);`
3. **Touch Target Size**: All interactive buttons, tabs, and links must have a minimum bounding tap target of `44x44px`.
4. **Column Wrapping**: Multicolumn grids must reflow into single columns on viewports under 768px.
5. **No AI Slop**: No decorative absolute-positioned pill badges that obscure text or navigation on smaller screens.

## Procedures
- Step 1: Inspect mobile viewport at 375px (iPhone SE width).
- Step 2: Implement flexible CSS grid or flexbox wrappers with auto-fit minmax.
- Step 3: Test on tablet (768px) and desktop (1280px).
- Step 4: Validate touch targets and lack of horizontal overflow.
