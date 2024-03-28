import {LunarObservationPost} from '../../../src/server/cards/moon/LunarObservationPost';
import {expect} from 'chai';
import {SpaceDebrisCleaningOperation} from '../../../src/server/cards/pathfinders/SpaceDebrisCleaningOperation';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {runAllActions} from '../../TestingUtils';
import {Penguins} from '../../../src/server/cards/promo/Penguins';
import {Tardigrades} from '../../../src/server/cards/base/Tardigrades';
import {OlympusConference} from '../../../src/server/cards/base/OlympusConference';
import {testGame} from '../../TestGame';

describe('SpaceDebrisCleaningOperation', function() {
  let card: SpaceDebrisCleaningOperation;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;

  beforeEach(function() {
    card = new SpaceDebrisCleaningOperation();
    [game, player, player2] = testGame(2);
    player.playedCards.push(card);
  });

  it('canPlay', function() {
    player.tagsForTest = {space: 3};
    expect(player.simpleCanPlay(card)).is.false;

    player.tagsForTest = {space: 4};
    expect(player.simpleCanPlay(card)).is.true;
  });

  it('canPlay, any 4 tags', function() {
    player2.tagsForTest = {space: 3};
    expect(player.simpleCanPlay(card)).is.false;

    player.tagsForTest = {space: 4};
    expect(player.simpleCanPlay(card)).is.true;
    expect(player2.simpleCanPlay(card)).is.true;
  });

  it('play', function() {
    const lunarObservationPost = new LunarObservationPost(); // Holds data.
    player.playedCards = [lunarObservationPost];

    player.cardsInHand = [];
    card.play(player);
    runAllActions(game);

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
    runAllActions(game);

    expect(tardigrades.resourceCount).eq(1);
    expect(penguins.resourceCount).eq(0);
    expect(olympusConference.resourceCount).eq(0);
  });
});
