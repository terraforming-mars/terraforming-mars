# Terraforming Mars card database

Generated from the game source by `npm run make:card-db`. Do not edit by hand —
regenerate instead. The schema of record is
`src/server/tools/cardDatabase/CardDatabaseTypes.ts`.

## Files

- `cards.json` — an array of every card in the `base`, `corpera` (Corporate Era)
  and `prelude` sets. Sorted by set, then by `id`. This is the whole database;
  read it in one go.
- `index.json` — the same cards reduced to `id`, `name`, `set`, `kind`, `type`,
  `cost`, `tags`, `vp` and `bespoke`. Use it to find a card, then look the full
  entry up in `cards.json` by `id`.

## Reading an entry

```json
{
  "id": "ai_central",
  "name": "AI Central",
  "set": "corpera",
  "kind": "project",
  "type": "active",
  "card_number": "208",
  "cost": 21,
  "tags": ["science", "building"],
  "vp": 1,
  "requirements": [{"type": "tag", "tag": "science", "min": 3}],
  "immediate": {"production": {"energy": -1}},
  "action": {"draw": {"count": 2}},
  "bespoke": false
}
```

- `kind` says how the card enters play: `project` (from hand), `corporation`
  (chosen at setup) or `prelude`.
- `type` is the printed card type: `automated`, `active`, `event`,
  `corporation` or `prelude`.
- `cost` is absent for corporations. `starting_megacredits` is present for
  corporations and preludes; **a negative value is a cost the player pays**, not
  a gain.
- `immediate` is what happens when the card is played. `action` is the
  repeatable action of an active card. `first_action` is a corporation's first
  action of the game.
- Card draws always appear as `"draw": {"count": n}`, never as
  `"gain": {"cards": n}`, because draws can carry qualifiers (`keep`, `pay`,
  `tag`, `type`, `resource`).
- Numbers inside an effect may instead be `{"dynamic": {...}}`, meaning the
  amount depends on the game state. `counts` says what is measured; `each`
  multiplies and `per` divides (rounding down). When `scope` is absent the
  default is your own assets for tags, and the whole board for tiles.

## `bespoke` and `semantics`

Most cards are described entirely by their structured fields. Some are not:
their effect lives in game code. Those carry `"bespoke": true` plus:

- `semantics` — plain-English statement of everything the structured fields
  cannot express. **Read this; the structured fields alone are incomplete.**
- `passive` — a list of `{trigger, effect}` pairs for continuous and triggered
  abilities.
- `play_restriction` — when the card may be played, or where its tile may go.

A card with `"bespoke": false` is fully described by its structured fields.

## Coverage

Only the `base`, `corpera` and `prelude` modules. Cards from Venus Next,
Colonies, Turmoil, Prelude 2, Promo and the fan expansions are not included. The
exporter throws rather than emitting partial data if it meets a mechanic it does
not model, so an entry that is present is an entry that is complete.
