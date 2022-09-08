import {expect} from 'chai';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {AdaptedLichen} from '../../../src/server/cards/base/AdaptedLichen';

describe('AdaptedLichen', function() {
  it('Should play', function() {
    const card = new AdaptedLichen();
    const game = newTestGame(1);
    const player = getTestPlayer(game, 0);

    card.play(player);
    expect(player.production.plants).to.eq(1);
  });
});
