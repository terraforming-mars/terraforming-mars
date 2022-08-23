import {expect} from 'chai';
import {Callisto} from '../../src/server/colonies/Callisto';
import {Game} from '../../src/server/Game';
import {Player} from '../../src/server/Player';
import {TestPlayer} from '../TestPlayer';
import {runAllActions} from '../TestingUtils';

describe('Callisto', function() {
  let callisto: Callisto;
  let player: Player;
  let player2: Player;
  let game: Game;

  beforeEach(function() {
    callisto = new Callisto();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, player2], player);
    game.gameOptions.coloniesExtension = true;
    game.colonies.push(callisto);
  });

  it('Should build', function() {
    callisto.addColony(player);
    expect(player.production.energy).to.eq(1);
    expect(player2.production.energy).to.eq(0);
  });

  it('Should trade', function() {
    callisto.trade(player);
    expect(player.energy).to.eq(2);
    expect(player2.energy).to.eq(0);
  });

  it('Should give trade bonus', function() {
    callisto.addColony(player);

    callisto.trade(player2);
    runAllActions(game);

    expect(player.production.energy).to.eq(1);
    expect(player2.production.energy).to.eq(0);
    expect(player.energy).to.eq(3);
    expect(player2.energy).to.eq(2);
  });
});
