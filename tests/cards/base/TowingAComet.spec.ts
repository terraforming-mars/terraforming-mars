
import {expect} from 'chai';
import {TowingAComet} from '../../../src/server/cards/base/TowingAComet';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';

describe('TowingAComet', function() {
  it('Should play', function() {
    const card = new TowingAComet();
    const player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    const game = Game.newInstance('gameid', [player, redPlayer], player);
    card.play(player);
    expect(player.plants).to.eq(2);
    expect(game.getOxygenLevel()).to.eq(1);
  });
});
