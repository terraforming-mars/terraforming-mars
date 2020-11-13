import {expect} from 'chai';
import {Callisto} from '../../src/colonies/Callisto';
import {Color} from '../../src/Color';
import {Player} from '../../src/Player';
import {Game} from '../../src/Game';
import {Resources} from '../../src/Resources';

describe('Callisto', function() {
  let callisto: Callisto; let player: Player; let player2: Player; let game: Game;

  beforeEach(function() {
    callisto = new Callisto();
    player = new Player('test', Color.BLUE, false);
    player2 = new Player('test2', Color.RED, false);
    game = new Game('foobar', [player, player2], player);
    game.gameOptions.coloniesExtension = true;
    game.colonies.push(callisto);
  });

  it('Should build', function() {
    callisto.onColonyPlaced(player, game);
    expect(player.getProduction(Resources.ENERGY)).to.eq(1);
    expect(player2.getProduction(Resources.ENERGY)).to.eq(0);
  });

  it('Should trade', function() {
    callisto.trade(player, game);
    expect(player.energy).to.eq(2);
    expect(player2.energy).to.eq(0);
  });

  it('Should give trade bonus', function() {
    callisto.onColonyPlaced(player, game);

    callisto.trade(player2, game);
    game.deferredActions.runAll(() => {});

    expect(player.getProduction(Resources.ENERGY)).to.eq(1);
    expect(player2.getProduction(Resources.ENERGY)).to.eq(0);
    expect(player.energy).to.eq(3);
    expect(player2.energy).to.eq(2);
  });
});
