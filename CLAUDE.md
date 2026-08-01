# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run build                # Full build: CSS + JSON static files, server (tsc), client (webpack)
npm run build:server         # TypeScript compile server only: tsc --build src/tsconfig.json
npm run build:client         # Webpack production bundle (runs make:cards first)
npm run build:test           # Compile tests: tsc --build tests/tsconfig.json
npm run lint                 # All lints: eslint + i18n audit + vue-tsc
npm run lint:client          # Vue type checking: vue-tsc --noEmit
npm run lint:server          # ESLint on src and tests
npm run lint:fix             # ESLint autofix
```

### Running Tests

```bash
npm run test                 # All tests (server + client)
npm run test:server          # Mocha server tests (~6700 tests)
npm run test:client          # Mochapack client component tests
npm run test:integration     # Run the PostgreSQL tests
# Single server test file
npx mocha --import=tsx --require tests/testing/setup.ts "tests/cards/base/Algae.spec.ts"

# Single client test file
cross-env NODE_ENV=development mochapack --require tests/client/components/setup.ts "tests/client/components/Board.spec.ts"
```

### Dev Servers

```bash
npm run dev:server           # Server with hot reload (tsx watch)
npm run dev:client           # Webpack watch mode
npm run watch:less           # CSS rebuild on change
```

However `npm run dev` is much easier to run and a little more powerful / flexible.

## Architecture

### Three-Layer Structure

- **`src/server/`** - Game engine, card logic, routes, database. Runs on Node.js.
- **`src/client/`** - Vue 3 frontend (Options API, `defineComponent`). Bundled with Webpack.
- **`src/common/`** - Shared types, enums, and models used by both client and server. No runtime logic that depends on either side.

The `@/` import alias maps to `./src/` (configured in tsconfig paths and webpack).

### Card System

Cards are the core domain object (~1000 cards across 15 modules). Each card involves:

1. **Card class** (`src/server/cards/<module>/CardName.ts`) - Extends `Card`, defines cost, tags, requirements, behavior, and metadata. Simple cards are purely declarative via the `behavior` property. Complex cards override `play()`, `action()`, `canAct()`, etc.
2. **CardName enum entry** (`src/common/cards/CardName.ts`) - Every card needs an enum value here.
3. **Module manifest** (`src/server/cards/<module>/<Module>CardManifest.ts`) - Registers the card's factory in a `ModuleManifest`. All manifests aggregate in `AllManifests.ts`.
4. **Card renderer** - Defined inline in the card's `metadata.renderData` using the `CardRenderer.builder()` DSL.
5. **Test** (`tests/cards/<module>/CardName.spec.ts`) - Uses `testGame()` and `TestPlayer` helpers.

Card types: `EVENT`, `ACTIVE` (has action), `AUTOMATED`, `PRELUDE`, `CORPORATION`, `CEO`, `STANDARD_PROJECT`, `STANDARD_ACTION`.

See the wiki's [Adding New Cards](https://github.com/terraforming-mars/terraforming-mars/wiki/Adding-New-Cards) page for practical advice (finding a similar existing card as a template, testing at `/cards` locally) and special-case mechanics (Robotic Workforce, Celestic, resource storage/VP interactions).

### Behavior System

The `Behavior` type (`src/server/behavior/Behavior.ts`) is a declarative DSL for card effects: production changes, resource gains, tile placement, TR changes, etc. Cards set `behavior` (on play) and/or `action` (repeatable) properties. The `BehaviorExecutor` (`src/server/behavior/Executor.ts`) interprets these at runtime. Prefer declarative `behavior` over imperative `play()` overrides when possible.

### Deferred Actions

Player choices and multi-step effects use `DeferredAction` (`src/server/deferredActions/`). Actions are queued via `game.defer(action)` with a `Priority` and resolved in order. The `.andThen()` callback chains follow-up logic after a deferred action resolves.

### Player Inputs

When a player needs to make a choice, the server returns a `PlayerInput` (e.g., `SelectSpace`, `SelectCard`, `OrOptions`). These live in `src/server/inputs/`. The client renders the appropriate UI based on the input type.

### Game Modules (Expansions)

Each expansion has its own directory under `src/server/cards/` and a manifest. Modules: `base`, `corpera` (Corporate Era), `promo`, `venus`, `colonies`, `prelude`, `prelude2`, `turmoil`, `community`, `ares`, `moon`, `pathfinders`, `ceo`, `starwars`, `underworld`. Cross-expansion card compatibility is declared via `compatibility` in `CardFactorySpec`.

The official expansions are base, corpera, promo, venus, colonies, prelude, prelude2, turmoil. Any other expansion is a fan expansion. Even still, promo has some cards that are almost fan expansions; they're the ones from the Dutch Open,
and are listed as such in CardName.ts

### Board System

Adding a new board touches several files:

1. **`BoardName` enum entry** (`src/common/boards/BoardName.ts`)
2. **Board class** (`src/server/boards/<BoardName>.ts`) - extends `Board`/`MarsBoard`
3. **`GameSetup.ts`** - register the factory in the `boards` record
4. **`src/server/awards/Awards.ts`** - add a board entry (can be `[]`)
5. **`src/server/milestones/Milestones.ts`** - add a board entry (can be `[]`)
6. **`src/client/components/Legends.ts`** - add a board entry (can be `[]`)
7. **`tests/routes/ApiCreateGame.spec.ts`** - add to the fan-map list if applicable

### Client Components

Vue 3 with Options API. Components are in `src/client/components/`. The root `App.ts` routes between screens. `PlayerHome.vue` is the main game view. Card rendering components are in `src/client/components/card/`. Styles use Less (`src/styles/`).

- New Vue components can use the Vue 3 style.
- Every new Vue component must have a test class, even if it is minially a sanity test. However, ask the user if they want feature-rich tests when creating new components. Not every feature needs a test.

### Database

Pluggable backends in `src/server/database/`: `SQLite`, `PostgreSQL`, `LocalFilesystem`. Games are serialized/deserialized through `SerializedGame`/`SerializedPlayer` types. `GameLoader` handles caching and retrieval.

### Wiki
Good wiki pages:
- [Databases](https://github.com/terraforming-mars/terraforming-mars/wiki/Databases)
- [dot-env](https://github.com/terraforming-mars/terraforming-mars/wiki/dot-env) pages for local setup
- [Development tips](https://github.com/terraforming-mars/terraforming-mars/wiki/Development-tips)
- [Changing game data for local testing](https://github.com/terraforming-mars/terraforming-mars/wiki/Changing-game-data-for-local-testing)

### Testing Patterns

- **`testGame(n, options?)`** - Creates a game with n players, returns `[game, ...players]`. Skips initial card selection by default.
- **`TestPlayer`** - Extends `Player` with test utilities. Use static factories: `TestPlayer.BLUE`, `TestPlayer.RED`, etc.
- Server card tests: instantiate the card, call `canPlay()`/`play()`/`action()`, assert state changes.
- Client tests: use `@vue/test-utils` mount/shallowMount with JSDOM setup from `tests/client/components/setup.ts`.
- Test framework: Mocha + Chai (expect style). Client tests use mochapack.

### Internationalization

Custom i18n via `src/client/directives/i18n.ts` with `v-i18n` directive. Translation files in `src/locales/`. Strings are matched by exact text content. See the wiki's [Translations](https://github.com/terraforming-mars/terraforming-mars/wiki/Translations) page for the contributor workflow.

## Style Guide

Read STYLE.md. Adhere to it as best as you can, alling out outliers.
