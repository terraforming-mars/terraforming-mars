import {LunarObservationPost} from '../../../src/cards/moon/LunarObservationPost';
import {expect} from 'chai';
import {SpaceDebrisCleaningOperation} from '../../../src/cards/pathfinders/SpaceDebrisCleaningOperation';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';
import {TestPlayers} from '../../TestPlayers';
import {TestingUtils} from '../../TestingUtils';
import {Penguins} from '../../../src/cards/promo/Penguins';
import {Tardigrades} from '../../../src/cards/base/Tardigrades';
import {OlympusConference} from '../../../src/cards/base/OlympusConference';

describe('SpaceDebrisCleaningOperation', function() {
  let card: SpaceDebrisCleaningOperation;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new SpaceDebrisCleaningOperation();
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('foobar', [player], player);
    player.playedCards.push(card);
  });

  it('canPlay', function() {
    player.tagsForTest = {space: 3};
    expect(player.canPlayIgnoringCost(card)).is.false;

    player.tagsForTest = {space: 4};
    expect(player.canPlayIgnoringCost(card)).is.true;
  });

  it('play', function() {
    const lunarObservationPost = new LunarObservationPost(); // Holds data.
    player.playedCards = [lunarObservationPost];

    player.cardsInHand = [];
    card.play(player);
    TestingUtils.runAllActions(game);

    expect(player.titanium).eq(3);
    expect(player.cardsInHand).has.length(1);
    expect(lunarObservationPost.resourceCount).eq(2); // Both "add resource" actions go to this card.
  });

  it('play - omit animal and science tags', function() {
    const tardigrades = new Tardigrades(); // microbe
    const penguins = new Penguins(); // animal
    const olympusConference = new OlympusConference(); // science
    player.playedCards = [tardigrades, penguins, olympusConference];

    card.play(player);
    TestingUtils.runAllActions(game);

    expect(tardigrades.resourceCount).eq(1);
    expect(penguins.resourceCount).eq(0);
    expect(olympusConference.resourceCount).eq(0);
  });
});
