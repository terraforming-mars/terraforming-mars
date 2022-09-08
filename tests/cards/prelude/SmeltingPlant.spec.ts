import {expect} from 'chai';
import {SmeltingPlant} from '../../../src/server/cards/prelude/SmeltingPlant';
import {getTestPlayer, newTestGame} from '../../TestGame';

describe('SmeltingPlant', function() {
  it('Should play', function() {
    const game = newTestGame(1);
    const player = getTestPlayer(game, 0);
    const card = new SmeltingPlant();
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.steel).to.eq(5);
    expect(game.getOxygenLevel()).to.eq(2);
  });
});
