import {expect} from 'chai';
import {ALL_MODULE_MANIFESTS} from '../../src/server/cards/AllManifests';
import {CardManifest} from '../../src/server/cards/ModuleManifest';
import {Card} from '../../src/server/cards/Card';
import {ICard} from '../../src/server/cards/ICard';
import {CardName} from '../../src/common/cards/CardName';

// Cards with a custom getCardDiscount that the player overview shows.
const DISPLAYED: ReadonlyArray<CardName> = [
  // Shown on the cards-in-hand discount badge. See src/client/components/overview/discounts.ts
  CardName.CUTTING_EDGE_TECHNOLOGY,
  CardName.XAVIER,
  CardName.ADHAI_HIGH_ORBIT_CONSTRUCTIONS,
  // Shown on their tags. See src/server/models/ModelUtils.ts
  CardName.MARS_DIRECT,
  CardName.CRESCENT_RESEARCH_ASSOCIATION,
];

// Cards with a custom getCardDiscount that the player overview intentionally does not show.
const NOT_DISPLAYED: ReadonlyArray<CardName> = [
  // Only discounts the card played right after it.
  CardName.INDENTURED_WORKERS,
  CardName.CONSCRIPTION,
  CardName.ECCENTRIC_SPONSOR,
  // Only applies the generation its action is used.
  CardName.FLOYD,
  CardName.ROGERS,
  // The discount belongs to the cards it holds.
  CardName.SELF_REPLICATING_ROBOTS,
];

describe('customDiscounts', () => {
  it('every card with a custom discount is either displayed or deliberately not displayed', () => {
    const found: Array<CardName> = [];
    for (const manifest of ALL_MODULE_MANIFESTS) {
      const manifests: Array<CardManifest<ICard>> = [
        manifest.projectCards,
        manifest.corporationCards,
        manifest.preludeCards,
        manifest.ceoCards,
        manifest.standardProjects,
        manifest.standardActions,
      ];
      for (const cardManifest of manifests) {
        for (const factory of CardManifest.values(cardManifest)) {
          const card = new factory.Factory();
          if (card.getCardDiscount !== undefined && card.getCardDiscount !== Card.prototype.getCardDiscount) {
            found.push(card.name);
          }
        }
      }
    }
    expect(found).to.have.members([...DISPLAYED, ...NOT_DISPLAYED]);
  });
});
