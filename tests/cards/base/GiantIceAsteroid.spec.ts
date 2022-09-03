import {expect} from 'chai';
import {GiantIceAsteroid} from '../../../src/server/cards/base/GiantIceAsteroid';
import {Game} from '../../../src/server/Game';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {Player} from '../../../src/server/Player';
import {TestPlayer} from '../../TestPlayer';
import {cast} from '../../TestingUtils';

describe('GiantIceAsteroid', function() {
  let card: GiantIceAsteroid;
  let player: Player;
  let player2: Player;
  let player3:Player;
  let game: Game;

  beforeEach(function() {
    card = new GiantIceAsteroid();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();
    player3 = TestPlayer.YELLOW.newPlayer();
    game = Game.newInstance('gameid', [player, player2, player3], player);
  });

  it('Should play', function() {
    player2.plants = 4;
    player3.plants = 6;
    card.play(player);
    expect(game.deferredActions).has.lengthOf(3);

    const firstOcean = cast(game.deferredActions.pop()!.execute(), SelectSpace);
    firstOcean.cb(firstOcean.availableSpaces[0]);
    const secondOcean = cast(game.deferredActions.pop()!.execute(), SelectSpace);
    secondOcean.cb(secondOcean.availableSpaces[1]);

    const orOptions = cast(game.deferredActions.pop()!.execute(), OrOptions);
    expect(orOptions.options).has.lengthOf(3);

    orOptions.options[0].cb();
    expect(player2.plants).to.eq(0);

    orOptions.options[1].cb();
    expect(player3.plants).to.eq(0);

    expect(game.getTemperature()).to.eq(-26);
    expect(player.getTerraformRating()).to.eq(24);
  });
});
