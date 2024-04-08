import {ALL_MODULE_MANIFESTS} from '../../src/server/cards/AllManifests';
import {CardManifest} from '../../src/server/cards/ModuleManifest';
import {ICard} from '../../src/server/cards/ICard';
import {CardResource} from '../../src/common/CardResource';
import {MoonCards} from '../../src/server/moon/MoonCards';
import {fail} from 'assert';

describe('MoonCards', function() {
  describe('Moon science card test', () => {
    function contains(card: ICard): boolean {
      return MoonCards.scienceCardsWithLessThan2VP.has(card.name) ||
         MoonCards.otherScienceCards.has(card.name);
    }
    function processDeck(deck: CardManifest<ICard>) {
      for (const factory of CardManifest.values(deck)) {
        const card = new factory.Factory();
        it('test card ' + card.name, () => {
          const included = contains(card);
          if (card.resourceType === CardResource.SCIENCE && !included) {
            fail('incorrectly absent');
          }
          if (card.resourceType !== CardResource.SCIENCE && included) {
            fail('incorrectly present');
          }
        });
      }
    }

    for (const manifest of ALL_MODULE_MANIFESTS) {
      for (const deck of [manifest.projectCards, manifest.corporationCards, manifest.preludeCards, manifest.ceoCards]) {
        processDeck(deck);
      }
    }
  });
});
