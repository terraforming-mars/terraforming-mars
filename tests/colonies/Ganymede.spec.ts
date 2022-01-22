import {expect} from 'chai';
import {Ganymede} from '../../src/colonies/Ganymede';
import {Game} from '../../src/Game';
import {Player} from '../../src/Player';
import {Resources} from '../../src/common/Resources';
import {TestPlayers} from '../TestPlayers';

describe('Ganymede', function() {
  let ganymede: Ganymede; let player: Player; let player2: Player; let game: Game;

  beforeEach(function() {
    ganymede = new Ganymede();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, player2], player);
    game.gameOptions.coloniesExtension = true;
    game.colonies.push(ganymede);
  });

  it('Should build', function() {
    ganymede.addColony(player);
    expect(player.getProduction(Resources.PLANTS)).to.eq(1);
    expect(player2.getProduction(Resources.PLANTS)).to.eq(0);
  });

  it('Should trade', function() {
    ganymede.trade(player);
    expect(player.plants).to.eq(1);
    expect(player2.plants).to.eq(0);
  });

  it('Should give trade bonus', function() {
    ganymede.addColony(player);

    ganymede.trade(player2);
    game.deferredActions.runAll(() => {});

    expect(player.getProduction(Resources.PLANTS)).to.eq(1);
    expect(player2.getProduction(Resources.PLANTS)).to.eq(0);
    expect(player.plants).to.eq(1);
    expect(player2.plants).to.eq(1);
  });
});
