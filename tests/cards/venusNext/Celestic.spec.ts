import {expect} from 'chai';
import {ALL_MODULE_MANIFESTS} from '../../../src/server/cards/AllCards';
import {Celestic} from '../../../src/server/cards/venusNext/Celestic';
import {testGame} from '../../TestGame';
import {CardName} from '../../../src/common/cards/CardName';
import {CardResource} from '../../../src/common/CardResource';
import {CardManifest} from '../../../src/server/cards/ModuleManifest';
import {CardType} from '../../../src/common/cards/CardType';
import {churnAction} from '../../TestingUtils';

describe('Celestic', function() {
  it('Should play', function() {
    const card = new Celestic();
    const [/* game */, player] = testGame(2);
    const play = card.play(player);
    expect(play).is.undefined;

    player.setCorporationForTest(card);

    expect(churnAction(card, player)).is.undefined;
    expect(card.resourceCount).to.eq(1);
    player.addResourceTo(card, 4);
    expect(card.getVictoryPoints(player)).to.eq(1);
  });

  it('Ensure static list contains all cards that mention floaters', function() {
    const found: Array<CardName> = [];
    ALL_MODULE_MANIFESTS.forEach((manifest) => {
      CardManifest.entries(manifest.projectCards).forEach((entry) => {
        const factory = entry[1];
        const card = new factory!.Factory();

        // Only looking for cards that mention floaters in the metadata
        // or requirements. Cards with floater resources don't need to be hand-verified.
        if (card.resourceType === CardResource.FLOATER) return;
        if (card.type === CardType.PROXY) return;

        const renderData = card.metadata.renderData;
        if (renderData === undefined) return;

        const string = JSON.stringify(renderData);
        if (string.includes('floater')) {
          found.push(card.name);
        } else if (card.requirements?.some((req) => req.floaters !== undefined)) {
          found.push(card.name);
        }
      });
    });
    expect(Array.from(Celestic.floaterCards.values())).to.have.members(found);
  });
});
