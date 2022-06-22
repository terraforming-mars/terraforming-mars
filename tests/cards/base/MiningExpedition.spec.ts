import {expect} from 'chai';
import {MiningExpedition} from '../../../src/cards/base/MiningExpedition';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';

describe('MiningExpedition', function() {
  let card : MiningExpedition; let player : Player; let player2 : Player; let game : Game;

  beforeEach(function() {
    card = new MiningExpedition();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, player2], player);
  });

  it('Should play', function() {
    player2.plants = 8;
    card.play(player);
    expect(game.deferredActions).has.lengthOf(1);

    const orOptions = game.deferredActions.peek()!.execute() as OrOptions;
    orOptions.options[0].cb();
    expect(player2.plants).to.eq(6);

    expect(player.steel).to.eq(2);
    expect(game.getOxygenLevel()).to.eq(1);
  });
});
