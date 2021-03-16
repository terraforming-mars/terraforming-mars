import {expect} from 'chai';
import {DeimosDown} from '../../../src/cards/base/DeimosDown';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';

describe('DeimosDown', function() {
  let card : DeimosDown; let player : Player; let player2 : Player; let game : Game;

  beforeEach(function() {
    card = new DeimosDown();
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

    expect(game.getTemperature()).to.eq(-24);
    expect(player.steel).to.eq(4);
    expect(player2.plants).to.eq(0);
  });

  it('Works fine in solo mode', function() {
    const game = Game.newInstance('foobar', [player], player);

    player.plants = 15;
    card.play(player);

    expect(game.getTemperature()).to.eq(-24);
    expect(player.steel).to.eq(4);
    expect(player.plants).to.eq(15); // not removed
  });
});
