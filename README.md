# kids_game_codex

A modular side-scrolling game project for parent+kids co-creation with small, reviewable diffs.

## Why this repo exists
- Teach kids that imagination can become software in tiny steps.
- Teach adults how to keep AI coding output readable, testable, and maintainable.
- Practice shipping incremental pull requests instead of giant monolithic drops.

## Iteration plan (small increments)
1. **Foundation (this PR)**
   - Modular project structure.
   - Playable prototype loop with slow movement and clear HUD.
   - Config-driven levels with kid-authored story details.
   - Unit + E2E tests and CI workflow.
2. **Combat + feedback pass**
   - Better enemy AI.
   - Distinct laser/star/cannon effect sprites and 3–5 second linger tuning.
3. **Level progression pass**
   - Real transition screen between levels.
   - End-of-level celebration/failure scenes.
4. **Content pass**
   - Replace placeholders with custom kid art and sound.
5. **Quality pass**
   - More integration tests, accessibility checks, performance budgets.

## Current architecture
```
src/
  audio/         # looping music manager
  config/        # level definitions, controls, objectives
  core/          # game loop, input
  entities/      # player and enemy objects
  systems/       # pure game rules (unit-test target)
  ui/            # reserved for UI components
tests/
  unit/          # fast deterministic tests
  e2e/           # browser flow tests (Playwright)
.github/workflows/ci.yml
```

## Run locally
```bash
npm install
npm run start
```
Open http://127.0.0.1:4173

- Level 1: `http://127.0.0.1:4173/?level=1`
- Level 2: `http://127.0.0.1:4173/?level=2`

- Controls: Left/Right = move, Up = jump.
- Level progression: Level 1 auto-advances to Level 2 on victory or time end.


## E2E test quickstart (first run)
```bash
npm install
npm run test:e2e:install
npm run test:e2e
```

Why this extra install step exists:
- Playwright needs a browser binary + Linux system libraries on first run.
- In GitHub Actions this is already handled by `npx playwright install --with-deps chromium` in CI.

## Test strategy (shift left)
- Unit tests validate pure rules in `src/systems/rules.js`.
- E2E tests validate HUD rendering and level loading.
- CI runs unit + e2e on every pull request.

## High-priority open questions (resolve before iteration 2)
1. Do you want keyboard-only forever, or should we add gamepad/touch controls for kids?
2. Should a level always auto-end at ~3 minutes even if objective not complete, or only on win/loss?
3. Should Level 2 treasures be visible objects in-world or tracked as off-screen missions?
4. Should we support local co-op turns (Player 1 + Player 2 profiles) with separate stats?
5. Do you want save/load progress between sessions?
6. Any restrictions on sound volume or flashing effects for accessibility/sensory comfort?

## Engineering rules in this repo
- Keep PRs small.
- Keep modules focused.
- Prefer pure functions for game rules.
- Add logs/comments where they improve debugging for both humans and AI assistance.
