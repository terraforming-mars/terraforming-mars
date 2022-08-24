import {expect} from 'chai';
import {Io} from '../../src/server/colonies/Io';
import {Game} from '../../src/server/Game';
import {Player} from '../../src/server/Player';
import {TestPlayer} from '../TestPlayer';
import {runAllActions} from '../TestingUtils';

describe('Io', function() {
  let io: Io;
  let player: Player;
  let player2: Player;
  let game: Game;

  beforeEach(function() {
    io = new Io();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, player2], player);
    game.gameOptions.coloniesExtension = true;
    game.colonies.push(io);
  });

  it('Should build', function() {
    io.addColony(player);
    expect(player.production.heat).to.eq(1);
    expect(player2.production.heat).to.eq(0);
  });

  it('Should trade', function() {
    io.trade(player);
    expect(player.heat).to.eq(3);
    expect(player2.heat).to.eq(0);
  });

  it('Should give trade bonus', function() {
    io.addColony(player);

    io.trade(player2);
    runAllActions(game);

    expect(player.production.heat).to.eq(1);
    expect(player2.production.heat).to.eq(0);
    expect(player.heat).to.eq(2);
    expect(player2.heat).to.eq(3);
  });
});
