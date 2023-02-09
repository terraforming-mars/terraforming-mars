import {expect} from 'chai';
import {MiningOperations} from '../../../src/server/cards/prelude/MiningOperations';
import {getTestPlayer, newTestGame} from '../../TestGame';

describe('MiningOperations', function() {
  it('Should play', function() {
    const card = new MiningOperations();
    const game = newTestGame(1);
    const player = getTestPlayer(game, 0);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.steel).to.eq(2);
    expect(player.steel).to.eq(4);
  });
});
