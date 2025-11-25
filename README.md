# Clockwork Eclipse

Clockwork Eclipse is a replayable circular tower-defense / arena roguelite built with vanilla HTML5 canvas and JavaScript. Hold back clockwise-moving enemies from the Core of the Eclipse, survive waves, and pick upgrades between rounds to push further.

## How to Play
1. Open `index.html` in a modern browser (no build step or server required).
2. Enemies travel clockwise around the ring; towers auto-fire within their sector.
3. Survive a wave, then choose one of three upgrades (add tower, enhance stats, or attach a special effect).
4. The run ends when the core HP hits zero or breaches exceed the limit. Press **Restart** on the game over overlay to try again.

## Features
- Circular arena with eight tower slots.
- Two enemy archetypes (balanced and swift) with scaling waves.
- Upgrade draft after each wave with stat boosts and special effects like slow, burn, and chain.
- Responsive layout tuned for desktop and mobile.
- Clean separation of state, entities, loop, upgrades, UI, and entry logic.

## Files
- `index.html` – main page and DOM structure.
- `css/reset.css`, `css/theme.css` – styling and layout.
- `js/state.js` – game state store and helpers.
- `js/entities.js` – enemy/tower definitions and circle math helpers.
- `js/core.js` – game loop and wave control.
- `js/upgrades.js` – upgrade catalog and random selection.
- `js/ui.js` – HUD and upgrade panel wiring.
- `js/main.js` – bootstraps everything on page load.

## Running & Developing
- Open `index.html` directly in the browser. For local dev with live reload, you can optionally serve the folder (e.g., `python3 -m http.server 8080`).
- Modify styling in `css/theme.css` per the rules in `DESIGN_GUIDE.md`.
- Extend game logic via the modular JS files described in `ARCHITECTURE.md`.
