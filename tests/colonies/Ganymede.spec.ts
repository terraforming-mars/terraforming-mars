import {expect} from 'chai';
import {Ganymede} from '../../src/server/colonies/Ganymede';
import {Game} from '../../src/server/Game';
import {Player} from '../../src/server/Player';
import {TestPlayer} from '../TestPlayer';
import {runAllActions} from '../TestingUtils';

describe('Ganymede', function() {
  let ganymede: Ganymede;
  let player: Player;
  let player2: Player;
  let game: Game;

  beforeEach(function() {
    ganymede = new Ganymede();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, player2], player);
    game.gameOptions.coloniesExtension = true;
    game.colonies.push(ganymede);
  });

  it('Should build', function() {
    ganymede.addColony(player);
    expect(player.production.plants).to.eq(1);
    expect(player2.production.plants).to.eq(0);
  });

  it('Should trade', function() {
    ganymede.trade(player);
    expect(player.plants).to.eq(1);
    expect(player2.plants).to.eq(0);
  });

  it('Should give trade bonus', function() {
    ganymede.addColony(player);

    ganymede.trade(player2);
    runAllActions(game);

    expect(player.production.plants).to.eq(1);
    expect(player2.production.plants).to.eq(0);
    expect(player.plants).to.eq(1);
    expect(player2.plants).to.eq(1);
  });
});
