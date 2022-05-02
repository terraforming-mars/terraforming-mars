import {Game} from '../../../src/Game';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {LunaProjectOffice} from '../../../src/cards/moon/LunaProjectOffice';
import {expect} from 'chai';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {IProjectCard} from '../../../src/cards/IProjectCard';
import {Player} from '../../../src/Player';

const MOON_OPTIONS = TestingUtils.setCustomGameOptions({moonExpansion: true});

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
      TestingUtils.setCustomGameOptions({
        moonExpansion: true,
        turmoilExtension: false,
      }));

    game.generation = 10;
    const card = new LunaProjectOffice();

    player.playedCards = [card];
    card.play(player);
    expect(LunaProjectOffice.isActive(player)).is.true;


    // End the generation. Player will draw 5 cards from and 1 more 5-card draw.

    finishGeneration(game);
    expect(game.getGeneration()).to.eq(11);

    expect(LunaProjectOffice.isActive(player)).is.true;
    expect(getWaitingFor(player).cards).has.length(5);

    // End the generation. Player will draw 5 cards from this generation.
    // Since this is the second generation after playing LPO, it is also the last.

    finishGeneration(game);
    expect(game.getGeneration()).to.eq(12);

    expect(LunaProjectOffice.isActive(player)).is.true;
    expect(getWaitingFor(player).cards).has.length(5);

    // End the generation. Player will draw 4 cards.

    finishGeneration(game);
    expect(game.getGeneration()).to.eq(13);

    expect(LunaProjectOffice.isActive(player)).is.false;
    expect(getWaitingFor(player).cards).has.length(4);
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
      TestingUtils.setCustomGameOptions({
        moonExpansion: true,
        draftVariant: true,
        turmoilExtension: false,
      }));

    game.generation = 10;
    const card = new LunaProjectOffice();

    player.playedCards = [card];
    card.play(player);
    expect(LunaProjectOffice.isActive(player)).is.true;

    // End the generation. Player will draw 5 cards this generation.

    finishGeneration(game);
    expect(game.getGeneration()).to.eq(11);

    expect(getWaitingFor(player).cards).has.length(5);
    expect(getWaitingFor(player).config.min).eq(2);
    expect(getWaitingFor(player).config.max).eq(2);
    expect(getWaitingFor(redPlayer).cards).has.length(4);

    // End the generation. Player will draw 5 cards this generation.
    // Since this is the second generation after playing LPO, it is also the last.

    finishGeneration(game);
    expect(game.getGeneration()).to.eq(12);

    expect(getWaitingFor(player).cards).has.length(5);
    expect(getWaitingFor(player).config.min).eq(2);
    expect(getWaitingFor(player).config.max).eq(2);
    expect(getWaitingFor(redPlayer).cards).has.length(4);
    expect(LunaProjectOffice.isActive(player)).is.true;

    // End the generation. Player will draw 4 cards.

    finishGeneration(game);
    expect(game.getGeneration()).to.eq(13);

    expect(LunaProjectOffice.isActive(player)).is.false;
    expect(getWaitingFor(player).cards).has.length(4);
    expect(getWaitingFor(player).config.min).eq(1);
    expect(getWaitingFor(player).config.max).eq(1);
    expect(getWaitingFor(redPlayer).cards).has.length(4);
  });

  // This test is almost exactly the same as the solo test, but it takes
  // different paths in the code.
  it('play - 2 player - no draft', function() {
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    const game = Game.newInstance(
      'id',
      [player, redPlayer],
      player,
      TestingUtils.setCustomGameOptions({
        moonExpansion: true,
        draftVariant: false,
        turmoilExtension: false,
      }));

    game.generation = 10;
    const card = new LunaProjectOffice();

    player.playedCards = [card];
    card.play(player);
    expect(LunaProjectOffice.isActive(player)).is.true;


    // End the generation. Player will draw 5 cards this generation.
    finishGeneration(game);
    expect(game.getGeneration()).to.eq(11);

    expect(LunaProjectOffice.isActive(player)).is.true;
    expect(getWaitingFor(player).cards).has.length(5);
    expect(getWaitingFor(player).config.min).eq(0);
    expect(getWaitingFor(redPlayer).cards).has.length(4);

    // End the generation. Player will draw 5 cards and no resources on
    // this card, so the generation after the player will only draw 4 cards.

    finishGeneration(game);
    expect(game.getGeneration()).to.eq(12);

    expect(getWaitingFor(player).cards).has.length(5);
    expect(getWaitingFor(player).config.min).eq(0);
    expect(getWaitingFor(redPlayer).cards).has.length(4);

    // End the generation. Player will draw 4 cards.

    finishGeneration(game);
    expect(game.getGeneration()).to.eq(13);

    expect(getWaitingFor(player).cards).has.length(4);
    expect(getWaitingFor(player).config.min).eq(0);
    expect(getWaitingFor(redPlayer).cards).has.length(4);
  });
});

function finishGeneration(game: Game): void {
  const priorGeneration = game.generation;
  game.getPlayersInGenerationOrder().forEach((player) => {
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
