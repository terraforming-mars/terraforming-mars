import {expect} from 'chai';
import {CrashSiteCleanup} from '../../../src/cards/promo/CrashSiteCleanup';
import {SmallAsteroid} from '../../../src/cards/promo/SmallAsteroid';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';

describe('CrashSiteCleanup', function() {
  let card : CrashSiteCleanup; let player : Player;

  beforeEach(function() {
    card = new CrashSiteCleanup();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t play', function() {
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Can play if removed plants from another player this generation', function() {
    const player2 = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, player2], player);
    player2.plants = 1;

    const smallAsteroid = new SmallAsteroid();
    smallAsteroid.play(player);
    // Choose Remove 1 plant option
    const orOptions = player.game.deferredActions.peek()!.execute() as OrOptions;
    orOptions.options[0].cb([player2]);

    expect(player.canPlayIgnoringCost(card)).is.true;
    expect(player.game.someoneHasRemovedOtherPlayersPlants).is.true;

    const action = card.play(player) as OrOptions;
    action.options[0].cb();
    expect(player.titanium).to.eq(1);
    action.options[1].cb();
    expect(player.steel).to.eq(2);
  });

  it('Can play if removed plants from neutral player in solo mode', function() {
    Game.newInstance('foobar', [player], player);
    const smallAsteroid = new SmallAsteroid();
    smallAsteroid.play(player);

    // Trigger plants removal
    expect(player.game.deferredActions).has.lengthOf(1);
    player.game.deferredActions.peek()!.execute();

    expect(player.canPlayIgnoringCost(card)).is.true;
    expect(player.game.someoneHasRemovedOtherPlayersPlants).is.true;
  });
});
