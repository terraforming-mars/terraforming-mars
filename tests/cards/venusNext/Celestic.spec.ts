import {expect} from 'chai';
import {ALL_CARD_MANIFESTS} from '../../../src/server/cards/AllCards';
import {Celestic} from '../../../src/server/cards/venusNext/Celestic';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {CardName} from '../../../src/common/cards/CardName';
import {CardResource} from '../../../src/common/CardResource';
import {RequirementType} from '../../../src/common/cards/RequirementType';

describe('Celestic', function() {
  it('Should play', function() {
    const card = new Celestic();
    const player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
    const play = card.play();
    expect(play).is.undefined;

    player.setCorporationForTest(card);

    const action = card.action(player);
    expect(action).is.undefined;
    expect(card.resourceCount).to.eq(1);
    player.addResourceTo(card, 4);
    expect(card.getVictoryPoints()).to.eq(1);
  });

  it('Ensure static list contains all cards that mention floaters', function() {
    const found: Array<CardName> = [];
    ALL_CARD_MANIFESTS.forEach((manifest) => {
      manifest.projectCards.factories.forEach((factory) => {
        const card = new factory.Factory();

        // Only looking for cards that mention floaters in the metadata
        // or requirements. Cards with floater resources don't need to be hand-verified.
        if (card.resourceType === CardResource.FLOATER) return;

        const renderData = card.metadata.renderData;
        if (renderData === undefined) return;

        const string = JSON.stringify(renderData);
        if (string.includes('floater')) {
          found.push(card.name);
        } else if (card.requirements !== undefined && card.requirements.requirements.some((req) => req.type === RequirementType.FLOATERS)) {
          found.push(card.name);
        }
      });
    });
    expect(Array.from(Celestic.floaterCards.values())).to.have.members(found);
  });
});
