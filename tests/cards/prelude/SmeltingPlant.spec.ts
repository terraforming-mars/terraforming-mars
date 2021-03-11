import {expect} from 'chai';
import {SmeltingPlant} from '../../../src/cards/prelude/SmeltingPlant';
import {Game} from '../../../src/Game';
import {TestPlayers} from '../../TestPlayers';

describe('SmeltingPlant', function() {
  it('Should play', function() {
    const player = TestPlayers.BLUE.newPlayer();
    const game = Game.newInstance('bar', [player], player);
    const card = new SmeltingPlant();
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.steel).to.eq(5);
    expect(game.getOxygenLevel()).to.eq(2);
  });
});
