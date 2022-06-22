import {expect} from 'chai';
import {GiantIceAsteroid} from '../../../src/cards/base/GiantIceAsteroid';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {SelectSpace} from '../../../src/inputs/SelectSpace';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';

describe('GiantIceAsteroid', function() {
  let card : GiantIceAsteroid; let player : Player; let player2 : Player; let player3 : Player; let game : Game;

  beforeEach(function() {
    card = new GiantIceAsteroid();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    player3 = TestPlayers.YELLOW.newPlayer();
    game = Game.newInstance('foobar', [player, player2, player3], player);
  });

  it('Should play', function() {
    player2.plants = 4;
    player3.plants = 6;
    card.play(player);
    expect(game.deferredActions).has.lengthOf(3);

    const firstOcean = game.deferredActions.pop()!.execute() as SelectSpace;
    firstOcean.cb(firstOcean.availableSpaces[0]);
    const secondOcean = game.deferredActions.pop()!.execute() as SelectSpace;
    secondOcean.cb(secondOcean.availableSpaces[1]);

    const orOptions = game.deferredActions.pop()!.execute() as OrOptions;
    expect(orOptions.options).has.lengthOf(3);

    orOptions.options[0].cb();
    expect(player2.plants).to.eq(0);

    orOptions.options[1].cb();
    expect(player3.plants).to.eq(0);

    expect(game.getTemperature()).to.eq(-26);
    expect(player.getTerraformRating()).to.eq(24);
  });
});

