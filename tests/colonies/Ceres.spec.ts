import {expect} from 'chai';
import {Ceres} from '../../src/server/colonies/Ceres';
import {Game} from '../../src/server/Game';
import {Player} from '../../src/server/Player';
import {TestPlayer} from '../TestPlayer';
import {runAllActions} from '../TestingUtils';

describe('Ceres', function() {
  let ceres: Ceres;
  let player: Player;
  let player2: Player;
  let game: Game;

  beforeEach(function() {
    ceres = new Ceres();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, player2], player);
    game.gameOptions.coloniesExtension = true;
    game.colonies.push(ceres);
  });

  it('Should build', function() {
    ceres.addColony(player);
    expect(player.production.steel).to.eq(1);
    expect(player2.production.steel).to.eq(0);
  });

  it('Should trade', function() {
    ceres.trade(player);
    expect(player.steel).to.eq(2);
    expect(player2.steel).to.eq(0);
  });

  it('Should give trade bonus', function() {
    ceres.addColony(player);

    ceres.trade(player2);
    runAllActions(game);

    expect(player.production.steel).to.eq(1);
    expect(player2.production.steel).to.eq(0);
    expect(player.steel).to.eq(2);
    expect(player2.steel).to.eq(2);
  });
});
