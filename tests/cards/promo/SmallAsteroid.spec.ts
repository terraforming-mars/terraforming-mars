import {expect} from 'chai';
import {SmallAsteroid} from '../../../src/cards/promo/SmallAsteroid';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/common/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('SmallAsteroid', function() {
  let card : SmallAsteroid; let player : Player; let player2 : Player;

  beforeEach(function() {
    card = new SmallAsteroid();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, player2], player);
  });

  it('Should play', function() {
    player2.addResource(Resources.PLANTS, 3);
    card.play(player);
    expect(player.game.deferredActions).has.lengthOf(1);

    const orOptions = player.game.deferredActions.peek()!.execute() as OrOptions;
    orOptions.options[1].cb(); // do nothing
    expect(player2.plants).to.eq(3);

    orOptions.options[0].cb();
    expect(player2.plants).to.eq(1);
    expect(player.game.getTemperature()).to.eq(-28);
  });

  it('Doesn\'t remove plants in solo mode', function() {
    player.addResource(Resources.PLANTS, 3);
    Game.newInstance('solo', [player], player);
    card.play(player);
    expect(player.getResource(Resources.PLANTS)).to.eq(3);
  });

  it('Works correctly with multiple targets', function() {
    const player3 = TestPlayers.YELLOW.newPlayer();
    Game.newInstance('foobar', [player, player2, player3], player);
    player2.addResource(Resources.PLANTS, 3);
    player3.addResource(Resources.PLANTS, 5);

    card.play(player);
    expect(player.game.deferredActions).has.lengthOf(1);

    const orOptions = player.game.deferredActions.peek()!.execute() as OrOptions;
    expect(orOptions.options).has.lengthOf(3);

    orOptions.options[2].cb(); // do nothing
    expect(player2.plants).to.eq(3);
    expect(player3.plants).to.eq(5);

    orOptions.options[0].cb();
    expect(player2.plants).to.eq(1);

    orOptions.options[1].cb();
    expect(player3.plants).to.eq(3);

    expect(player.game.getTemperature()).to.eq(-28);
  });
});
