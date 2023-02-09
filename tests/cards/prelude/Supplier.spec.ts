import {expect} from 'chai';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {Supplier} from '../../../src/server/cards/prelude/Supplier';

describe('Supplier', function() {
  it('Should play', function() {
    const game = newTestGame(1);
    const player = getTestPlayer(game, 0);
    const card = new Supplier();
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.energy).to.eq(2);
    expect(player.steel).to.eq(4);
  });
});
