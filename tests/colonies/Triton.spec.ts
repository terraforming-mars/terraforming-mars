import {expect} from 'chai';
import {Triton} from '../../src/colonies/Triton';
import {Game} from '../../src/Game';
import {Player} from '../../src/Player';
import {TestPlayers} from '../TestPlayers';
import {TestingUtils} from '../TestingUtils';

describe('Triton', function() {
  let triton: Triton; let player: Player; let player2: Player; let game: Game;

  beforeEach(function() {
    triton = new Triton();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, player2], player);
    game.gameOptions.coloniesExtension = true;
    game.colonies.push(triton);
  });

  it('Should build', function() {
    triton.addColony(player);
    expect(player.titanium).to.eq(3);
  });

  it('Should trade', function() {
    triton.trade(player);
    expect(player.titanium).to.eq(1);
    expect(player2.titanium).to.eq(0);
  });

  it('Should give trade bonus', function() {
    triton.addColony(player);

    triton.trade(player2);
    TestingUtils.runAllActions(game);

    expect(player.titanium).to.eq(4);
    expect(player2.titanium).to.eq(1);
  });
});
