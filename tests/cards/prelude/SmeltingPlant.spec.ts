import {expect} from 'chai';
import {SmeltingPlant} from '../../../src/server/cards/prelude/SmeltingPlant';
import {testGame} from '../../TestGame';

describe('SmeltingPlant', function() {
  it('Should play', function() {
    const [game, player] = testGame(1);
    const card = new SmeltingPlant();
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.steel).to.eq(5);
    expect(game.getOxygenLevel()).to.eq(2);
  });
});
