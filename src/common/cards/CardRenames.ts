import {CardName} from './CardName';

// Maps old/alternate card name spellings to their canonical CardName values.
// When renaming a card, add the old name here with a TODO and removal date.
// Remember to add a test in tests/common/cards/CardRenames.spec.ts.
export const CARD_RENAMES = new Map<string, CardName>([
  // #2839: Fix card names to match printed English versions
  ['Thorgate', CardName.THORGATE],
  ['Terralabs Research', CardName.TERRALABS_RESEARCH],
  ['Astrodrill', CardName.ASTRODRILL],
  ['EcoLine', CardName.ECOLINE],
  ['Colony', CardName.BUILD_COLONY_STANDARD_PROJECT],
]);

export function resolveCardName(cardName: CardName): CardName {
  return CARD_RENAMES.get(cardName) ?? cardName;
}
