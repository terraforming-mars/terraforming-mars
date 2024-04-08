import {expect} from 'chai';
import {SmallAsteroid} from '../../../src/server/cards/promo/SmallAsteroid';
import {Game} from '../../../src/server/Game';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {Resource} from '../../../src/common/Resource';
import {TestPlayer} from '../../TestPlayer';
import {cast} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('SmallAsteroid', function() {
  let card: SmallAsteroid;
  let player: TestPlayer;
  let player2: TestPlayer;
  let player3: TestPlayer;

  beforeEach(function() {
    card = new SmallAsteroid();
    [/* game */, player, player2, player3] = testGame(3);
  });

  it('Should play', function() {
    player2.stock.add(Resource.PLANTS, 3);
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
    player.stock.add(Resource.PLANTS, 3);
    Game.newInstance('gameid', [player], player);
    card.play(player);
    expect(player.plants).to.eq(3);
  });

  it('Works correctly with multiple targets', function() {
    player2.stock.add(Resource.PLANTS, 3);
    player3.stock.add(Resource.PLANTS, 5);

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
