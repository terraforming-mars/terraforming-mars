import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {MarsMaths} from '../../../src/server/cards/pathfinders/MarsMaths';
import {TestPlayer} from '../../TestPlayer';
import {Game} from '../../../src/server/Game';
import {cast, finishGeneration, testGameOptions} from '../../TestingUtils';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {IProjectCard} from '../../../src/server/cards/IProjectCard';
import {Player} from '../../../src/server/Player';

describe('MarsMaths', function() {
  let card: MarsMaths;

  beforeEach(() => {
    card = new MarsMaths();
  });

  it('On Action', function() {
    const [, player] = testGame(1);
    const previousActions = player.actionsThisRound;
    card.action(player);
    expect(player.actionsThisRound).eq(previousActions + 2);
  });

  it('play - solo', function() {
    const [game, player] = testGame(1, {
      pathfindersExpansion: true,
      turmoilExtension: false,
    });
    player.setCorporationForTest(card);
    game.generation = 10;

    // End the generation. Player will draw 5 cards
    finishGeneration(game);
    expect(game.getGeneration()).to.eq(11);
    expect(getWaitingFor(player).cards).has.length(5);
  });

  // This test is almost exactly the same as the solo test, but they take
  // different paths in the code.
  it('play - 2 player - draft', function() {
    const [game, player, player2] = testGame(2, {
      pathfindersExpansion: true,
      draftVariant: true,
      turmoilExtension: false,
    });
    player.setCorporationForTest(card);
    game.generation = 10;

    // End the generation. Player will draw 5 cards
    finishGeneration(game);
    expect(game.getGeneration()).to.eq(11);

    expect(getWaitingFor(player).cards).has.length(5);
    expect(getWaitingFor(player).config.min).eq(2);
    expect(getWaitingFor(player).config.max).eq(2);
    expect(getWaitingFor(player2).cards).has.length(4);
  });

  // This test is almost exactly the same as the solo test, but it takes
  // different paths in the code.
  it('play - 2 player - no draft', function() {
    const [game, player, player2] = testGame(2, {
      pathfindersExpansion: true,
      draftVariant: false,
      turmoilExtension: false,
    });
    player.setCorporationForTest(card);
    game.generation = 10;

    player.playedCards = [card];

    // End the generation. Player will draw 5 cards
    finishGeneration(game);
    expect(game.getGeneration()).to.eq(11);

    expect(getWaitingFor(player).cards).has.length(5);
    expect(getWaitingFor(player).config.min).eq(0);
    expect(getWaitingFor(player).config.max).eq(4);
    expect(getWaitingFor(player2).cards).has.length(4);
  });
});

function getWaitingFor(player: Player): SelectCard<IProjectCard> {
  return cast(player.getWaitingFor(), SelectCard<IProjectCard>);
}
