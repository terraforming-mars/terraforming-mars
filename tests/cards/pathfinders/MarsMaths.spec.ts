import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {MarsMaths} from '../../../src/server/cards/pathfinders/MarsMaths';
import {cast, finishGeneration, runAllActions} from '../../TestingUtils';
import {SelectCard} from '../../../src/server/inputs/SelectCard';

describe('MarsMaths', function() {
  let card: MarsMaths;

  beforeEach(() => {
    card = new MarsMaths();
  });

  it('On Action', function() {
    const [/* game */, player] = testGame(1);
    const previousActions = player.availableActionsThisRound;
    card.action(player);
    expect(player.availableActionsThisRound).eq(previousActions + 2);
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
    const selectCard = cast(player.popWaitingFor(), SelectCard);
    expect(selectCard.cards).has.length(5);
  });

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

    const selectCard = cast(player.popWaitingFor(), SelectCard);
    expect(selectCard.cards).has.length(5);
    expect(selectCard.config.min).eq(2);
    expect(selectCard.config.max).eq(2);

    const selectCard2 = cast(player2.popWaitingFor(), SelectCard);
    expect(selectCard2.cards).has.length(4);

    selectCard.cb([selectCard.cards[0], selectCard.cards[1]]);
    selectCard2.cb([selectCard2.cards[0]]);

    runAllActions(game);

    const selectCardb = cast(player.popWaitingFor(), SelectCard);
    expect(selectCardb.cards).has.length(3);
    expect(selectCardb.config.min).eq(1);
    expect(selectCardb.config.max).eq(1);

    const selectCardb2 = cast(player2.popWaitingFor(), SelectCard);
    expect(selectCardb2.cards).has.length(3);
  });

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

    const selectCard = cast(player.popWaitingFor(), SelectCard);
    expect(selectCard.cards).has.length(5);
    expect(selectCard.config.min).eq(0);
    expect(selectCard.config.max).eq(4);
    const selectCard2 = cast(player2.popWaitingFor(), SelectCard);
    expect(selectCard2.cards).has.length(4);
  });
});
