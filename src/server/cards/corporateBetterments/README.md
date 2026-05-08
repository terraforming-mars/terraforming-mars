# Fanmade Cards — Corporate Betterments Set

51 fan-made Terraforming Mars project cards (B01–B55, some gaps).
All cards require adding their `CardName` entries to `src/common/cards/CardName.ts`
and registering `FANMADE_CARD_MANIFEST` in `src/server/cards/AllManifests.ts`.

---

## Integration Steps

1. **Add CardName entries** from `CardNameAdditions.ts` into the enum in
   `src/common/cards/CardName.ts`.

2. **Copy card files** into `src/server/cards/fanmade/` (create the folder).

3. **Register the manifest** — in `src/server/cards/AllManifests.ts`, add:
   ```ts
   import {FANMADE_CARD_MANIFEST} from './fanmade/FanmadeCardManifest';
   // ...
   export const ALL_MODULE_MANIFESTS = [...existingManifests, FANMADE_CARD_MANIFEST];
   ```

4. **Fix import paths** — the card files currently use relative paths starting with
   `../../../src/`. Inside the repo, drop the leading `src/` segment since the files
   will live in `src/server/cards/fanmade/`.

---

## Card Status

### ✅ Fully implemented (standard mechanics)

| ID | Card | Type | Notes |
|----|------|------|-------|
| B01 | Futuristic Centre | Active | cardDiscount applies to all plays (not just research phase) |
| B02 | Architectural Contracts | Active | Uses `cardDiscount: {tag: Tag.CITY}` + `getStandardProjectDiscount` |
| B03 | Martian Safari | Active | onCardPlayed trigger for Animal tags; tag VP |
| B04 | Slow-Growth Plantation | Active | Or action: add microbe / 5 microbes → greenery |
| B05 | Underwater Outpost | Active | draw 2 keep 1 via behavior |
| B06 | Asteroid Fragmentation | Event | Pay 6 heat+3 steel+3 titanium → +3 TR |
| B08 | Weather Control | Event | 2 MC per own tile, 1 MC per opponents' tiles |
| B09 | Interplanetary Adv. Network | Automated | +1 TR per city you own on Mars |
| B10 | Jovian Belt Mining Operations | Automated | +2 Ti prod, others +1 Ti prod |
| B11 | Seabed Extraction | Automated | Steel per ocean count |
| B13 | Greenery Embellishment | Automated | +2 MC prod per city adjacent to greenery |
| B15 | Biomass Reactor | Active | action: plant prod -1 → energy prod +1; +4 energy prod |
| B16 | Great Ocean Laboratory | Active | onCardPlayed for microbe tags; VP per microbe tag |
| B18 | Martian Hotels | Automated | 5 MC per pair of building tags; 1 MC per others' building tags |
| B19 | Rooftop Gardens | Active | onTilePlaced: city → 2 plants |
| B20 | Green Areas Integration | Event | Spend 3 plants up to 5× for +1 TR each |
| B22 | Pipes | Automated | 1 MC per own tile adjacent to ocean |
| B24 | Lunar Mantle Excavation | Active | X energy → X steel; -3 energy prod; 3 VP |
| B25 | Microbe Cultures | Active | 1 heat → 1 microbe / 5 heat → 2 microbes |
| B26 | Wild Boars | Active | Remove opponent plant → add animal; 1 VP per animal |
| B27 | Excess Water | Active | onTilePlaced: ocean → +2 MC |
| B29 | Photoreflectors | Active | 4 energy → +1 TR; 1 VP |
| B30 | Monopoly Breakup | Event | Claim milestone ignoring limit (requires enemy +10 TR) |
| B31 | Io Thermalization | Active | titanium → heat prod OR heat prod -2 → TR; 2 VP |
| B32 | Venusian Transports | Active | action: 1 MC per Venus tag; req 12% Venus |
| B33 | Seed Sharing | Automated | +2 plant prod; all players +2 plants |
| B36 | Nuke an Asteroid | Automated | +2 Ti prod; distribute 5 Ti to opponents |
| B37 | Family Advertising | Event | Re-enable 2 used action cards this generation |
| B38 | Company Restructuring | Event | Discard cards for 3 MC each; opponents get 2 MC per discard |
| B39 | Advanced Schools | Automated | 3 MC per own science tag; 1 MC per opponents' |
| B40 | Venusian Heat Exchangers | Active | or: heat prod -2 → TR / remove 2 floaters → heat prod +2 |
| B42 | Urban Planning Strategies | Automated | +2 TR per own city adj ocean+2 greeneries; +1 TR for opponents' |
| B43 | Venusian Fluctuating Plants | Active | add 1 floater / 3 plants → 2 floaters; req 6% Venus |
| B45 | Assisted Growth Plants | Automated | Req max oxygen; places 3 greeneries (1 via behavior + TODO) |
| B47 | Energetic Infrastructures | Automated | 5 MC per own power tag; 2 MC per opponents' power tags |
| B48 | Venus-Earth Partnership | Automated | Req 3 earth + 3 venus tags; 5 VP |
| B49 | Base on Titan | Active | 2 Ti → +1 TR; req 3 Jovian; 1 VP per Jovian tag |
| B51 | Venusian Ecology | Active | 3 plants → Venus +1; req 12% Venus |
| B54 | Zero-G Drilling Operations | Active | X steel → X titanium; +3 steel prod; req 5 science |
| B55 | Martian Lizards | Active | 1 heat → 1 animal / 6 heat → 2 animals; 1 VP per 2 animals |

---

### ⚠️ Partially implemented / needs additional work

| ID | Card | Issue |
|----|------|-------|
| B14 | Venusian Collaboration | Floater card auto-selects first floater card; should use `AddResourcesToCard` with player choice |
| B17 | Ingegneri Spaziali | Opponent card selection is simplified; needs deferred selection per opponent |
| B28 | Market Manipulation | `SelectColony` input type may need verification against actual API |
| B35 | Joint Venture | Shared city ownership requires engine changes |
| B38 | Company Restructuring | Opponent discard loop needs deferred actions per opponent |
| B41 | Mass Urbanization | Only 1 city placed via behavior; needs 2 more deferred `PlaceCityTile` calls |
| B44 | Twin Planet Commerce Network | Off-world city count uses Moon expansion only; definition of "off-world city" may vary |
| B45 | Assisted Growth Plants | Only 1 greenery via behavior; needs 2 more `PlaceGreeneryTile` calls |

---

### 🔴 Stub only — requires engine/design work

| ID | Card | What's needed |
|----|------|---------------|
| B34 | Company Incentives | Ares-style placement bonus on 3 selected spaces (SpaceBonus/AdjacencyBonus) |
| B46 | Martian Samples | Space reservation system: exclusive-use markers on 3 spaces |
| B52 | Smuggling Operations | Trade colony without advancing track; needs colony internals hook |
| B53 | Company Merger | Mid-game corp/prelude application; major engine work |
| B50 | Company Cartel | Sequential multi-player card selection (deferred action chain) |

---

## Notes on Card Numbers
Cards B07, B12, B21, and B23 were not present in the uploaded images.
