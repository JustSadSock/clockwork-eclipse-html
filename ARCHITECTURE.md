# Clockwork Eclipse Architecture

This project is a lightweight HTML/JS canvas game. Everything runs client-side with plain JavaScript modules and no build step.

## File Responsibilities

- **index.html** – Shell page, loads CSS/JS modules and defines the HUD, canvas, upgrade panel, and overlays.
- **css/reset.css** – Opinionated reset for consistent defaults.
- **css/theme.css** – Implements the Clockwork Eclipse visual language defined in `DESIGN_GUIDE.md`.
- **js/state.js** – Centralized game state: wave number, core HP, breach count, enemy and tower arrays, slot definitions, pause flags, and resources. Exposes helpers to reset, mutate, and query state.
- **js/entities.js** – Data models and helpers for enemies and towers. Handles circular math (angles, world coordinates), enemy movement, and tower targeting/attack cooldowns.
- **js/core.js** – Main loop and progression. Coordinates updating enemies/towers, spawning waves, checking win/loss, and toggling between action and upgrade phases.
- **js/upgrades.js** – Upgrade catalog plus random selection logic. Each upgrade carries a description and an `apply` function to mutate state (add tower, boost stats, add effects).
- **js/ui.js** – HUD rendering, upgrade choice panel, wave banners, and game over overlay. Manages DOM bindings and communicates selections back to the core.
- **js/main.js** – Entry point: wires up the canvas and UI, initializes state, kicks off the first wave, and handles restart/start events.

## Data Flow
- `state.js` owns mutable game data. Other modules import functions to read/update the state but do not recreate the store.
- `core.js` imports state helpers, `entities.js` logic, and upgrade generators to run the frame loop and wave lifecycle.
- `ui.js` subscribes to user actions (upgrade selection, restart). It calls back into `core.js` helpers to apply upgrades and start waves.
- `upgrades.js` operates on state via exported mutators (e.g., add tower, modify tower stats).

## Circular Arena Model
- Arena defined by a center point and radii for track and core. Enemies travel clockwise by increasing their angle. Position on screen is computed with `x = centerX + cos(angle) * radius` and `y = centerY + sin(angle) * radius`.
- Tower slots are evenly spaced angles (`2π / slots`). Each tower tracks its own cooldown, range in radians, damage, and optional effects (slow, burn, chain).
- Towers pick the closest enemy within angular distance. Shots are represented visually as glowing arcs or pulses.

## Progression Loop
1. Start wave: spawn a set of enemies based on wave number and type weights.
2. Action phase: main loop updates movement, tower firing, collisions, and breach checks.
3. If all enemies are cleared: pause movement/spawning, present three random upgrades.
4. Apply upgrade → move to next wave with increased challenge.
5. If core HP reaches 0 or breaches exceed limit: show game over overlay with restart option.

## Extending
- Add new enemy/tower types by expanding `entities.js` and `upgrades.js` with new stats and behaviors.
- Adjust layout/visuals in `css/theme.css` following the rules in `DESIGN_GUIDE.md`.
- Add audio or persistence by extending `main.js` and `state.js` (e.g., save high scores in `localStorage`).
