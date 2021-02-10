import {Game} from '../../../src/Game';
import {setCustomGameOptions, TestPlayers} from '../../TestingUtils';
import {LunaProjectOffice} from '../../../src/cards/moon/LunaProjectOffice';
import {expect} from 'chai';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {IProjectCard} from '../../../src/cards/IProjectCard';
import {Player} from '../../../src/Player';

const MOON_OPTIONS = setCustomGameOptions({moonExpansion: true});

describe('LunaProjectOffice', () => {
  it('can play', () => {
    const player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('id', [player], player, MOON_OPTIONS);
    const card = new LunaProjectOffice();

    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    player.tagsForTest = {science: 2};
    expect(player.getPlayableCards()).does.include(card);

    player.tagsForTest = {science: 1};
    expect(player.getPlayableCards()).does.not.include(card);
  });

  it('play - solo', function() {
    const player = TestPlayers.BLUE.newPlayer();
    const game = Game.newInstance(
      'id',
      [player],
      player,
      setCustomGameOptions({
        moonExpansion: true,
        turmoilExtension: false,
      }));

    const card = new LunaProjectOffice();

    player.playedCards = [card];
    card.play(player);
    expect(card.resourceCount).eq(2);

    game.generation = 2;

    // End the generation. Player will have 5 cards to draw and 1 more 5-card draw.

    finishGeneration(game);
    expect(game.getGeneration()).to.eq(3);

    expect(getWaitingFor(player).cards).has.length(5);
    expect(card.resourceCount).eq(1);

    // End the generation. Player will have 5 cards to draw and no more 5-card draws.

    finishGeneration(game);
    expect(game.getGeneration()).to.eq(4);

    expect(getWaitingFor(player).cards).has.length(5);
    expect(card.resourceCount).eq(0);

    // End the generation. Player will have 4 cards to draw and no more 5-card draws.

    finishGeneration(game);
    expect(game.getGeneration()).to.eq(5);

    expect(getWaitingFor(player).cards).has.length(4);
    expect(card.resourceCount).eq(0);
  });

  // This test is almost exactly the same as the solo test, but they take
  // different paths in the code.
  it('play - 2 player - draft', function() {
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    const game = Game.newInstance(
      'id',
      [player, redPlayer],
      player,
      setCustomGameOptions({
        moonExpansion: true,
        draftVariant: true,
        turmoilExtension: false,
      }));
    const card = new LunaProjectOffice();

    player.playedCards = [card];
    card.play(player);
    expect(card.resourceCount).eq(2);

    game.generation = 2;

    // End the generation. Player will have 5 cards to draw and 1 more 5-card draw.

    finishGeneration(game);
    expect(game.getGeneration()).to.eq(3);

    expect(getWaitingFor(player).cards).has.length(5);
    expect(getWaitingFor(player).minCardsToSelect).eq(2);
    expect(getWaitingFor(player).maxCardsToSelect).eq(2);
    expect(getWaitingFor(redPlayer).cards).has.length(4);
    expect(card.resourceCount).eq(1);


    // End the generation. Player will have 5 cards to draw and no more 5-card draws.

    finishGeneration(game);
    expect(game.getGeneration()).to.eq(4);

    expect(getWaitingFor(player).cards).has.length(5);
    expect(getWaitingFor(player).minCardsToSelect).eq(2);
    expect(getWaitingFor(player).maxCardsToSelect).eq(2);
    expect(getWaitingFor(redPlayer).cards).has.length(4);
    expect(card.resourceCount).eq(0);

    // End the generation. Player will have 4 cards to draw and no more 5-card draws.

    finishGeneration(game);
    expect(game.getGeneration()).to.eq(5);

    expect(getWaitingFor(player).cards).has.length(4);
    expect(getWaitingFor(player).minCardsToSelect).eq(1);
    expect(getWaitingFor(player).maxCardsToSelect).eq(1);
    expect(getWaitingFor(redPlayer).cards).has.length(4);
    expect(card.resourceCount).eq(0);
  });

  // This test is almost exactly the same as the solo test, but they take
  // different paths in the code.
  it('play - 2 player - no draft', function() {
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    const game = Game.newInstance(
      'id',
      [player, redPlayer],
      player,
      setCustomGameOptions({
        moonExpansion: true,
        draftVariant: false,
        turmoilExtension: false,
      }));
    const card = new LunaProjectOffice();

    player.playedCards = [card];
    card.play(player);
    expect(card.resourceCount).eq(2);

    game.generation = 2;

    // End the generation. Player will have 5 cards to draw and 1 more 5-card draw.

    finishGeneration(game);
    expect(game.getGeneration()).to.eq(3);

    expect(getWaitingFor(player).cards).has.length(5);
    expect(getWaitingFor(player).minCardsToSelect).eq(0);
    expect(getWaitingFor(redPlayer).cards).has.length(4);
    expect(card.resourceCount).eq(1);


    // End the generation. Player will have 5 cards to draw and no more 5-card draws.

    finishGeneration(game);
    expect(game.getGeneration()).to.eq(4);

    expect(getWaitingFor(player).cards).has.length(5);
    expect(getWaitingFor(player).minCardsToSelect).eq(0);
    expect(getWaitingFor(redPlayer).cards).has.length(4);
    expect(card.resourceCount).eq(0);

    // End the generation. Player will have 4 cards to draw and no more 5-card draws.

    finishGeneration(game);
    expect(game.getGeneration()).to.eq(5);

    expect(getWaitingFor(player).cards).has.length(4);
    expect(getWaitingFor(player).minCardsToSelect).eq(0);
    expect(getWaitingFor(redPlayer).cards).has.length(4);
    expect(card.resourceCount).eq(0);
  });
});

function finishGeneration(game: Game): void {
  const priorGeneration = game.generation;
  game.getPlayers().forEach((player) => {
    game.playerHasPassed(player);
    game.playerIsFinishedTakingActions();
  });
  const currentGeneration = game.generation;
  if (currentGeneration !== priorGeneration + 1) {
    console.log('uh oh');
  }
}

function getWaitingFor(player: Player): SelectCard<IProjectCard> {
  const action = player.getWaitingFor();
  expect(action).instanceof(SelectCard);
  return action as SelectCard<IProjectCard>;
}
