import {expect} from 'chai';
import {ALL_MODULE_MANIFESTS} from '../../src/server/cards/AllManifests';
import {CardManifest} from '../../src/server/cards/ModuleManifest';
import {ICard} from '../../src/server/cards/ICard';
import {CardType} from '../../src/common/cards/CardType';

describe('CardMetadata', () => {
  it('should have a VP icon', () => {
    ALL_MODULE_MANIFESTS.forEach((manifest) => {
      const factories: CardManifest<ICard> = {...manifest.projectCards, ...manifest.corporationCards};

      for (const factory of CardManifest.values(factories)) {
        const card = new factory.Factory();
        if (card.type === CardType.PROXY) continue;
        if (card.victoryPoints !== undefined) {
          // if (card.victoryPoints === 'special') {
          expect(card.metadata.victoryPoints, card.name + ' should have victoryPoints metadata').is.not.undefined;
        } else if (card.victoryPoints === undefined) {
          expect(card.metadata.victoryPoints, card.name + ' should not have victoryPoints metadata').is.undefined;
        }
      }
    });
  });
});
