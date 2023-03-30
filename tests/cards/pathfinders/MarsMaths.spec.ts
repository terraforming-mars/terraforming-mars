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
  it('On Action', function() {
    const card = new MarsMaths();
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

    game.generation = 10;
    const card = new MarsMaths();

    player.playedCards = [card];
    card.play(player);
    expect(MarsMaths.isActive(player)).is.true;

    // End the generation. Player will draw 5 cards from and 1 more 5-card draw.
    finishGeneration(game);
    expect(game.getGeneration()).to.eq(11);

    expect(MarsMaths.isActive(player)).is.true;
    expect(getWaitingFor(player).cards).has.length(5);
  });

  // This test is almost exactly the same as the solo test, but they take
  // different paths in the code.
  it('play - 2 player - draft', function() {
    const player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    const game = Game.newInstance(
      'gameid',
      [player, redPlayer],
      player,
      testGameOptions({
        pathfindersExpansion: true,
        draftVariant: true,
        turmoilExtension: false,
      }));

    game.generation = 10;
    const card = new MarsMaths();

    player.playedCards = [card];
    card.play(player);
    expect(MarsMaths.isActive(player)).is.true;

    // End the generation. Player will draw 5 cards this generation.

    finishGeneration(game);
    expect(game.getGeneration()).to.eq(11);

    expect(getWaitingFor(player).cards).has.length(5);
    expect(getWaitingFor(player).config.min).eq(2);
    expect(getWaitingFor(player).config.max).eq(2);
    expect(getWaitingFor(redPlayer).cards).has.length(4);
  });

  // This test is almost exactly the same as the solo test, but it takes
  // different paths in the code.
  it('play - 2 player - no draft', function() {
    const player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    const game = Game.newInstance(
      'gameid',
      [player, redPlayer],
      player,
      testGameOptions({
        pathfindersExpansion: true,
        draftVariant: false,
        turmoilExtension: false,
      }));

    game.generation = 10;
    const card = new MarsMaths();

    player.playedCards = [card];
    card.play(player);
    expect(MarsMaths.isActive(player)).is.true;


    // End the generation. Player will draw 5 cards this generation.
    finishGeneration(game);
    expect(game.getGeneration()).to.eq(11);

    expect(MarsMaths.isActive(player)).is.true;
    expect(getWaitingFor(player).cards).has.length(5);
    expect(getWaitingFor(player).config.min).eq(0);
    expect(getWaitingFor(redPlayer).cards).has.length(4);
  });
});

function getWaitingFor(player: Player): SelectCard<IProjectCard> {
  return cast(player.getWaitingFor(), SelectCard<IProjectCard>);
}
