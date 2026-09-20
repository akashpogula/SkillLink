# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]
- **M16**: Final Polish. Ensured all components map to `DESIGN_SYSTEM.md`. Refined empty states, error messaging, and transitions.
- **M14-M15**: Responsive optimization (added mobile filter drawer for Client Search) and tested End-to-End frontend lifecycle.
- **M12-M13**: Implemented Service Request Lifecycle (Client creates -> Provider Accepts/Declines -> In Service -> Completed -> Client leaves Review) with Mock Notifications.
- **M5-M7**: Built Provider Single Page Application (`pages/provider.html`) with multi-step onboarding wizard and request management dashboard.
- **Architecture**: Created `js/state.js` to persist shared mock data to `localStorage` enabling cross-page simulated backend interactions.
- **M3**: Built Client Experience Single Page Application (`pages/client.html`) including Client Onboarding, Dashboard, Search & Filters, and Provider Profiles using Vanilla JS lightweight state management. Extended `mock-data.js` to include robust provider profiles.
- **M2 (Polish)**: Replaced placeholder content with high-quality generative imagery for service categories and featured providers. Replaced placeholder text with realistic mock data and applied "SkillConnect" branding throughout.
- **M2**: Built interactive landing page (`index.html`) featuring custom cursor, magnetic buttons, and scroll-triggered storytelling animations.
- **M1**: Finalized `DESIGN_SYSTEM.md` and established CSS variables in `global.css`.
- **M0**: Initialization established. Structure, documentation, and mock data foundation created.

### Added
- Fluid typography using CSS clamp() for robust scaling across viewports.
- Interactive 'magnetic' buttons and premium micro-interactions (box-shadow lifts, scale effects).
- Atmospheric background with layered radial gradients to increase visual depth.

### Changed
- Complete restructure of Landing page HTML and CSS to support asymmetrical editorial layouts.
- Overhauled Client Dashboard and Provider Dashboard to feel like actionable workspaces rather than basic card grids.
- Rewrote all user-facing copy to be warmer, more conversational, and less robotic.

### Fixed
- Restored custom cursor interaction which was dropped in the M16 overhaul.
- Replaced static background with an animated atmospheric background using CSS keyframes and radial gradients.
- Fixed issue where provider onboarding Back/Next buttons were rendering as native browser controls by migrating button classes to global.css.
- Overhauled onboarding form containers across client and provider to utilize a new glass-panel UI system.
