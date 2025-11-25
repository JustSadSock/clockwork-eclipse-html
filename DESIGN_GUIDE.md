# Clockwork Eclipse Design Guide

## Theme Overview
Clockwork Eclipse blends dark celestial eclipse imagery with ornate clockwork accents. The palette mixes near-black night hues, burnished metal, and teal glows to evoke arcane machinery powered by lunar energy.

### Color Palette
- **Midnight Gradient:** #050814 to #0f1b2d (background sky)
- **Gold/Bronze Accent:** #C49A3F
- **Copper Shadow:** #8B6A2B
- **Teal Highlight:** #3EC6B6
- **Pale Cyan Glow:** #9EE7E0
- **Alert Red:** #E35B5B (damage/critical indicators)
- **Soft White Text:** #E8F0FF

### Typography
- Base font: `"Segoe UI", "Helvetica Neue", Arial, sans-serif` for readability.
- Headers use uppercase, widened letter spacing, gold borders, and teal glows to imply clockwork engravings.

### Layout Rules
- **Desktop (width ≥ 768px):**
  - Use a two/three-column flex layout. Canvas centered and prominent.
  - HUD anchored to the top/left with compact metallic panels.
  - Upgrade panel aligned to bottom/right with three clearly separated selectable plates.
- **Mobile (width < 768px):**
  - Stack HUD → Canvas → Upgrade panel vertically.
  - Increase touch targets and spacing; buttons at least 44px high.

### Component Styling
- **Background:** radial + linear gradient from midnight to deep navy; subtle star speckles allowed via low-opacity noise.
- **Panels:** resemble metal plates: dark base (#0f1b2d) with bronze borders and inner teal glow. Avoid soft shadows; prefer crisp outlines and subtle inset glows.
- **Buttons:** metallic segments or clock plates; use bordered rings, slight gradient from #8B6A2B to #C49A3F, with teal inner glow on hover/active. No generic white cards with grey shadows.
- **Upgrade Choices:** appear as glyph-like plates with engraved headers, teal glow on hover, and clear selection highlight. Titles in uppercase with letter spacing.
- **Indicators & Rings:** use concentric circles and dashed rings to reference clockwork dials. Shots/arcs can glow teal or cyan.
- **Glows & Outlines:** soft teal/cyan outer glows for energy, bronze outlines for structure. Keep contrast high for readability.
- **Health/Danger:** use alert red (#E35B5B) for critical HP/breach states.

### Motion & Feedback
- Tower firing shows quick teal arcs or pulses. Enemy movement is smooth clockwise motion. Selection/hover adds a cyan outer glow and slight scale.

### Accessibility
- Maintain contrast between text and background. Do not use pure white backgrounds. Ensure hover states also convey focus/active via outline changes, not just color.
