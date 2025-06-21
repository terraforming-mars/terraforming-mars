import {expect} from 'chai';
import {cast} from '../../TestingUtils';
import {CrashSiteCleanup} from '../../../src/server/cards/promo/CrashSiteCleanup';
import {SmallAsteroid} from '../../../src/server/cards/promo/SmallAsteroid';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('CrashSiteCleanup', () => {
  let card: CrashSiteCleanup;
  let player: TestPlayer;
  let player2: TestPlayer;

  beforeEach(() => {
    card = new CrashSiteCleanup();
    [/* game */, player, player2] = testGame(2);
  });

  it('Can not play', () => {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Can play if removed plants from another player this generation', () => {
    player2.plants = 1;
    const smallAsteroid = new SmallAsteroid();
    smallAsteroid.play(player);
    // Choose Remove 1 plant option
    const orOptions = cast(player.game.deferredActions.peek()!.execute(), OrOptions);
    orOptions.options[0].cb([player2]);

    expect(card.canPlay(player)).is.true;
    expect(player.game.someoneHasRemovedOtherPlayersPlants).is.true;

    const action = cast(card.play(player), OrOptions);
    action.options[0].cb();
    expect(player.titanium).to.eq(1);
    action.options[1].cb();
    expect(player.steel).to.eq(2);
  });

  it('Can play if removed plants from neutral player in solo mode', () => {
    [/* game */, player] = testGame(1);
    const smallAsteroid = new SmallAsteroid();
    smallAsteroid.play(player);

    // Trigger plants removal
    expect(player.game.deferredActions).has.lengthOf(1);
    player.game.deferredActions.peek()!.execute();

    expect(card.canPlay(player)).is.true;
    expect(player.game.someoneHasRemovedOtherPlayersPlants).is.true;
  });
});
