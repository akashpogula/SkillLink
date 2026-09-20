# Design System (Post-M16 Premium Overhaul)

This document outlines the visual language and design foundation for SkillConnect, following the POST-M16 premium redesign instructions.

## Visual Direction
**Premium + Sophisticated + Warm + Interactive**
- **Premium**: Expansive whitespace, subtle atmospheric backgrounds, refined typography.
- **Warm & Human**: Softer colors (pale blues, indigos), conversational copy.
- **Interactive**: Meaningful micro-interactions, responsive hover states, smooth transitions.
- **Layout**: Editorial asymmetrical layouts rather than standard "dashboard cards" everywhere.

## Typography
- **Body/UI Font**: `Inter` (or system-ui).
- **Display Font**: `Outfit` (or similar modern geometric sans).
- **Font Scale (Fluid Typography via Clamp)**:
  - Display: `clamp(2.8rem, 3.19vi + 2rem, 5.5rem)`
  - H1: `clamp(2.33rem, 2.18vi + 1.79rem, 3.5rem)`
  - H2: `clamp(1.94rem, 1.48vi + 1.57rem, 2.75rem)`
  - H3: `clamp(1.62rem, 1vi + 1.37rem, 2.06rem)`
  - H4: `clamp(1.35rem, 0.67vi + 1.18rem, 1.5rem)`

## Color Tokens
- **Backgrounds**: 
  - Primary: `#f8fafe` (Soft pale blue-white) + Layered Radial Gradients
  - Secondary: `#ffffff`
  - Tertiary: `#f1f4fb`
- **Text**:
  - Primary: `#0f172a` (Deep navy/ink)
  - Secondary: `#475569`
  - Tertiary: `#94a3b8`
- **Brand/Accent**: `#4f46e5` (Indigo)
- **Borders**: Highly subtle, `rgba(148, 163, 184, 0.2)`

## Spacing & Layout
- **Container Max-Width**: `1200px` to maintain comfortable reading lengths.
- **Spacing Scale**: Expanded to include 6rem and 8rem for generous vertical rhythm.

## Components & Shadows
- **Buttons**: Pill-shaped (fully rounded), box-shadow lifts, and subtle glow on primary hover.
- **Cards/Containers**: Softer borders with `1.25rem` radius. Shadows are deep but diffuse (e.g., `0 12px 32px -4px rgba(15, 23, 42, 0.08)` on hover).

## Transitions & Animation
- `fade-up`, `scroll-reveal`, and `scale-in` animations driven by CSS classes.
- Standard transition: `400ms cubic-bezier(0.16, 1, 0.3, 1)` for smooth, premium motion.
- Strict adherence to `prefers-reduced-motion`.

## Glass UI & Ambient Backgrounds
- **Glass Panels**: White backgrounds are now treated as translucent glass panels (\gba(255, 255, 255, 0.75)\) with a heavy backdrop-filter blur (\20px\) to allow ambient light through.
- **Ambient Orbs**: Large, slow-moving blurred orbs act as an atmospheric background, floating across the viewport behind the glass panels.
