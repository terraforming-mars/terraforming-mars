import {expect} from 'chai';
import {CrashSiteCleanup} from '../../../src/cards/promo/CrashSiteCleanup';
import {SmallAsteroid} from '../../../src/cards/promo/SmallAsteroid';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestingUtils';

describe('CrashSiteCleanup', function() {
  let card : CrashSiteCleanup; let player : Player; let game : Game;

  beforeEach(function() {
    card = new CrashSiteCleanup();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t play', function() {
    expect(card.canPlay(player, game)).is.not.true;
  });

  it('Can play if removed plants from another player this generation', function() {
    const player2 = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('foobar', [player, player2], player);
    player2.plants = 1;

    const smallAsteroid = new SmallAsteroid();
    smallAsteroid.play(player, game);
    // Choose Remove 1 plant option
    const orOptions = game.deferredActions.next()!.execute() as OrOptions;
    orOptions.options[0].cb([player2]);

    expect(card.canPlay(player, game)).is.true;
    expect(game.someoneHasRemovedOtherPlayersPlants).is.true;

    const action = card.play(player) as OrOptions;
    action.options[0].cb();
    expect(player.titanium).to.eq(1);
    action.options[1].cb();
    expect(player.steel).to.eq(2);
  });

  it('Can play if removed plants from neutral player in solo mode', function() {
    game = Game.newInstance('foobar', [player], player);
    const smallAsteroid = new SmallAsteroid();
    smallAsteroid.play(player, game);

    // Trigger plants removal
    expect(game.deferredActions).has.lengthOf(1);
        game.deferredActions.next()!.execute();

        expect(card.canPlay(player, game)).is.true;
        expect(game.someoneHasRemovedOtherPlayersPlants).is.true;
  });
});
