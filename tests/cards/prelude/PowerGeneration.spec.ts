import {expect} from 'chai';
import {PowerGeneration} from '../../../src/server/cards/prelude/PowerGeneration';
import {getTestPlayer, newTestGame} from '../../TestGame';

describe('PowerGeneration', function() {
  it('Should play', function() {
    const card = new PowerGeneration();
    const game = newTestGame(1);
    const player = getTestPlayer(game, 0);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.energy).to.eq(3);
  });
});
