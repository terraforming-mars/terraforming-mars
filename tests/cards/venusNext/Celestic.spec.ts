import {expect} from 'chai';
import {ALL_CARD_MANIFESTS} from '../../../src/cards/AllCards';
import {Celestic} from '../../../src/cards/venusNext/Celestic';
import {Game} from '../../../src/Game';
import {TestPlayers} from '../../TestPlayers';
import {CardName} from '../../../src/common/cards/CardName';
import {ResourceType} from '../../../src/common/ResourceType';
import {RequirementType} from '../../../src/cards/RequirementType';

describe('Celestic', function() {
  it('Should play', function() {
    const card = new Celestic();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);
    const play = card.play();
    expect(play).is.undefined;

    player.corporationCard = card;

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
        if (card.resourceType === ResourceType.FLOATER) return;

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
