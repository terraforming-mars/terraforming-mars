import {expect} from 'chai';
import {Io} from '../../src/colonies/Io';
import {Color} from '../../src/Color';
import {Player} from '../../src/Player';
import {Game} from '../../src/Game';
import {Resources} from '../../src/Resources';

describe('Io', function() {
  let io: Io; let player: Player; let player2: Player; let game: Game;

  beforeEach(function() {
    io = new Io();
    player = new Player('test', Color.BLUE, false);
    player2 = new Player('test2', Color.RED, false);
    game = new Game('foobar', [player, player2], player);
    game.gameOptions.coloniesExtension = true;
    game.colonies.push(io);
  });

  it('Should build', function() {
    io.onColonyPlaced(player, game);
    expect(player.getProduction(Resources.HEAT)).to.eq(1);
    expect(player2.getProduction(Resources.HEAT)).to.eq(0);
  });

  it('Should trade', function() {
    io.trade(player, game);
    expect(player.heat).to.eq(3);
    expect(player2.heat).to.eq(0);
  });

  it('Should give trade bonus', function() {
    io.onColonyPlaced(player, game);

    io.trade(player2, game);
    game.deferredActions.runAll(() => {});

    expect(player.getProduction(Resources.HEAT)).to.eq(1);
    expect(player2.getProduction(Resources.HEAT)).to.eq(0);
    expect(player.heat).to.eq(2);
    expect(player2.heat).to.eq(3);
  });
});
