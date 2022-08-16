import {expect} from 'chai';
import {SmallAsteroid} from '../../../src/server/cards/promo/SmallAsteroid';
import {Game} from '../../../src/server/Game';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {Player} from '../../../src/server/Player';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';
import {cast} from '../../TestingUtils';

describe('SmallAsteroid', function() {
  let card: SmallAsteroid;
  let player: Player;
  let player2: Player;

  beforeEach(function() {
    card = new SmallAsteroid();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, player2], player);
  });

  it('Should play', function() {
    player2.addResource(Resources.PLANTS, 3);
    card.play(player);
    expect(player.game.deferredActions).has.lengthOf(1);

    const orOptions = cast(player.game.deferredActions.peek()!.execute(), OrOptions);
    orOptions.options[1].cb(); // do nothing
    expect(player2.plants).to.eq(3);

    orOptions.options[0].cb();
    expect(player2.plants).to.eq(1);
    expect(player.game.getTemperature()).to.eq(-28);
  });

  it('Doesn not remove plants in solo mode', function() {
    player.addResource(Resources.PLANTS, 3);
    Game.newInstance('gameid', [player], player);
    card.play(player);
    expect(player.getResource(Resources.PLANTS)).to.eq(3);
  });

  it('Works correctly with multiple targets', function() {
    const player3 = TestPlayer.YELLOW.newPlayer();
    Game.newInstance('gameid', [player, player2, player3], player);
    player2.addResource(Resources.PLANTS, 3);
    player3.addResource(Resources.PLANTS, 5);

    card.play(player);
    expect(player.game.deferredActions).has.lengthOf(1);

    const orOptions = cast(player.game.deferredActions.peek()!.execute(), OrOptions);
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
