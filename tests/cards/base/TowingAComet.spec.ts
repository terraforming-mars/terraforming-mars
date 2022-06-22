
import {expect} from 'chai';
import {TowingAComet} from '../../../src/cards/base/TowingAComet';
import {Game} from '../../../src/Game';
import {TestPlayers} from '../../TestPlayers';

describe('TowingAComet', function() {
  it('Should play', function() {
    const card = new TowingAComet();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('foobar', [player, redPlayer], player);
    card.play(player);
    expect(player.plants).to.eq(2);
    expect(game.getOxygenLevel()).to.eq(1);
  });
});
