import {expect} from 'chai';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {CoronaExtractor} from '../../../src/server/cards/colonies/CoronaExtractor';

describe('CoronaExtractor', function() {
  it('Should play', function() {
    const card = new CoronaExtractor();
    const game = newTestGame(1);
    const player = getTestPlayer(game, 0);
    expect(player.canPlayIgnoringCost(card)).is.not.true;
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.energy).to.eq(4);
  });
});
