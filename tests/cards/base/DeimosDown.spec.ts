import {expect} from 'chai';
import {cast} from '../../TestingUtils';
import {DeimosDown} from '../../../src/server/cards/base/DeimosDown';
import {Game} from '../../../src/server/Game';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {Player} from '../../../src/server/Player';
import {TestPlayer} from '../../TestPlayer';

describe('DeimosDown', function() {
  let card: DeimosDown;
  let player: Player;
  let player2: Player;
  let game: Game;

  beforeEach(function() {
    card = new DeimosDown();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, player2], player);
  });

  it('Should play', function() {
    player2.plants = 8;
    card.play(player);

    expect(game.deferredActions).has.lengthOf(1);
    const orOptions = cast(game.deferredActions.peek()!.execute(), OrOptions);
    orOptions.options[0].cb();

    expect(game.getTemperature()).to.eq(-24);
    expect(player.steel).to.eq(4);
    expect(player2.plants).to.eq(0);
  });

  it('Works fine in solo mode', function() {
    const game = Game.newInstance('gameid', [player], player);

    player.plants = 15;
    card.play(player);

    expect(game.getTemperature()).to.eq(-24);
    expect(player.steel).to.eq(4);
    expect(player.plants).to.eq(15); // not removed
  });
});
