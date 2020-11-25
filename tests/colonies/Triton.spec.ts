import {expect} from 'chai';
import {Triton} from '../../src/colonies/Triton';
import {Color} from '../../src/Color';
import {Player} from '../../src/Player';
import {Game} from '../../src/Game';

describe('Triton', function() {
  let triton: Triton; let player: Player; let player2: Player; let game: Game;

  beforeEach(function() {
    triton = new Triton();
    player = new Player('test', Color.BLUE, false);
    player2 = new Player('test2', Color.RED, false);
    game = new Game('foobar', [player, player2], player);
    game.gameOptions.coloniesExtension = true;
    game.colonies.push(triton);
  });

  it('Should build', function() {
    triton.addColony(player, game);
    expect(player.titanium).to.eq(3);
  });

  it('Should trade', function() {
    triton.trade(player, game);
    expect(player.titanium).to.eq(1);
    expect(player2.titanium).to.eq(0);
  });

  it('Should give trade bonus', function() {
    triton.addColony(player, game);

    triton.trade(player2, game);
    game.deferredActions.runAll(() => {});

    expect(player.titanium).to.eq(4);
    expect(player2.titanium).to.eq(1);
  });
});
