import {expect} from 'chai';
import {Mohole} from '../../../src/server/cards/prelude/Mohole';
import {getTestPlayer, newTestGame} from '../../TestGame';

describe('Mohole', function() {
  it('Should play', function() {
    const card = new Mohole();
    const game = newTestGame(1);
    const player = getTestPlayer(game, 0);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.heat).to.eq(3);
    expect(player.heat).to.eq(3);
  });
});
