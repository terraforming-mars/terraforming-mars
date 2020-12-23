import {expect} from 'chai';
import {Ceres} from '../../src/colonies/Ceres';
import {Game} from '../../src/Game';
import {Player} from '../../src/Player';
import {Resources} from '../../src/Resources';
import {TestPlayers} from '../TestingUtils';

describe('Ceres', function() {
  let ceres: Ceres; let player: Player; let player2: Player; let game: Game;

  beforeEach(function() {
    ceres = new Ceres();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, player2], player);
    game.gameOptions.coloniesExtension = true;
    game.colonies.push(ceres);
  });

  it('Should build', function() {
    ceres.addColony(player, game);
    expect(player.getProduction(Resources.STEEL)).to.eq(1);
    expect(player2.getProduction(Resources.STEEL)).to.eq(0);
  });

  it('Should trade', function() {
    ceres.trade(player, game);
    expect(player.steel).to.eq(2);
    expect(player2.steel).to.eq(0);
  });

  it('Should give trade bonus', function() {
    ceres.addColony(player, game);

    ceres.trade(player2, game);
    game.deferredActions.runAll(() => {});

    expect(player.getProduction(Resources.STEEL)).to.eq(1);
    expect(player2.getProduction(Resources.STEEL)).to.eq(0);
    expect(player.steel).to.eq(2);
    expect(player2.steel).to.eq(2);
  });
});
