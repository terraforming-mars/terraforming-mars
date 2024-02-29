import {expect} from 'chai';
import {ThiolavaVents} from '../../../src/server/cards/underworld/ThiolavaVents';
import {testGame} from '../../TestGame';
import {addOcean, runAllActions} from '../../TestingUtils';
import {Resource} from '../../../src/common/Resource';

describe('ThiolavaVents', () => {
  it('canPlay', () => {
    const card = new ThiolavaVents();
    const [/* game */, player, opponent] = testGame(2);

    expect(card.canPlay(player)).is.false;
    addOcean(opponent);
    expect(card.canPlay(player)).is.true;
  });

  it('play', () => {
    const card = new ThiolavaVents();
    const [game, player] = testGame(2);

    card.play(player);
    runAllActions(game);
    expect(player.production.heat).eq(2);
    expect(card.resourceCount).eq(2);
  });

  it('effect', () => {
    const card = new ThiolavaVents();
    const [/* game */, player] = testGame(2);

    player.playedCards.push(card);
    player.production.add(Resource.ENERGY, 2);
    expect(card.resourceCount).eq(0);
    player.production.add(Resource.HEAT, 3);
    expect(card.resourceCount).eq(3);
  });
});
