
import {expect} from 'chai';
import {TowingAComet} from '../../../src/cards/base/TowingAComet';
import {Game} from '../../../src/Game';
import {TestPlayers} from '../../TestingUtils';

describe('TowingAComet', function() {
  it('Should play', function() {
    const card = new TowingAComet();
    const player = TestPlayers.BLUE.newPlayer();
    const game = new Game('foobar', [player, player], player);
    card.play(player, game);
    expect(player.plants).to.eq(2);
    expect(game.getOxygenLevel()).to.eq(1);
  });
});
