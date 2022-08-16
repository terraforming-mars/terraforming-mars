import {expect} from 'chai';
import {BigAsteroid} from '../../../src/server/cards/base/BigAsteroid';
import {Game} from '../../../src/server/Game';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {Player} from '../../../src/server/Player';
import {TestPlayer} from '../../TestPlayer';
import {runAllActions, cast} from '../../TestingUtils';

describe('BigAsteroid', function() {
  let card: BigAsteroid;
  let player: Player;
  let player2: Player;
  let game: Game;

  beforeEach(function() {
    card = new BigAsteroid();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, player2], player);
  });

  it('Should play', function() {
    player2.plants = 5;
    card.play(player);
    runAllActions(game);

    const orOptions = cast(player.getWaitingFor(), OrOptions);
    orOptions.options[1].cb(); // do nothing
    expect(player2.plants).to.eq(5);

    orOptions.options[0].cb(); // remove plants
    expect(player2.plants).to.eq(1);
    expect(game.getTemperature()).to.eq(-26);
    expect(player.titanium).to.eq(4);
  });

  it('Works fine in solo', function() {
    game = Game.newInstance('gameid', [player], player);
    player.plants = 5;
    card.play(player);
    expect(game.deferredActions).has.lengthOf(1);
    const input = game.deferredActions.peek()!.execute();
    expect(input).is.undefined;

    expect(player.plants).to.eq(5);
    expect(game.getTemperature()).to.eq(-26);
    expect(player.titanium).to.eq(4);
  });
});
