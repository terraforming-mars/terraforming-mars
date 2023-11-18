import {expect} from 'chai';
import {cast, finishGeneration} from '../../TestingUtils';
import {LunaProjectOffice} from '../../../src/server/cards/moon/LunaProjectOffice';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {IProjectCard} from '../../../src/server/cards/IProjectCard';
import {IPlayer} from '../../../src/server/IPlayer';
import {testGame} from '../../TestGame';

describe('LunaProjectOffice', () => {
  it('can play', () => {
    const [/* game */, player] = testGame(1, {moonExpansion: true});
    const card = new LunaProjectOffice();

    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    player.tagsForTest = {science: 2};
    expect(player.getPlayableCardsForTest()).does.include(card);

    player.tagsForTest = {science: 1};
    expect(player.getPlayableCardsForTest()).does.not.include(card);
  });

  it('play - solo', function() {
    const [game, player] = testGame(1, {
      moonExpansion: true,
    });

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
    const [game, player, player2] = testGame(2, {
      moonExpansion: true,
      draftVariant: true,
      turmoilExtension: false,
    });

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
    expect(getWaitingFor(player2).cards).has.length(4);

    // End the generation. Player will draw 5 cards this generation.
    // Since this is the second generation after playing LPO, it is also the last.

    finishGeneration(game);
    expect(game.getGeneration()).to.eq(12);

    expect(getWaitingFor(player).cards).has.length(5);
    expect(getWaitingFor(player).config.min).eq(2);
    expect(getWaitingFor(player).config.max).eq(2);
    expect(getWaitingFor(player2).cards).has.length(4);
    expect(LunaProjectOffice.isActive(player)).is.true;

    // End the generation. Player will draw 4 cards.

    finishGeneration(game);
    expect(game.getGeneration()).to.eq(13);

    expect(LunaProjectOffice.isActive(player)).is.false;
    expect(getWaitingFor(player).cards).has.length(4);
    expect(getWaitingFor(player).config.min).eq(1);
    expect(getWaitingFor(player).config.max).eq(1);
    expect(getWaitingFor(player2).cards).has.length(4);
  });

  // This test is almost exactly the same as the solo test, but it takes
  // different paths in the code.
  it('play - 2 player - no draft', function() {
    const [game, player, player2] = testGame(2, {
      moonExpansion: true,
      draftVariant: false,
    });

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
    expect(getWaitingFor(player2).cards).has.length(4);

    // End the generation. Player will draw 5 cards and no resources on
    // this card, so the generation after the player will only draw 4 cards.

    finishGeneration(game);
    expect(game.getGeneration()).to.eq(12);

    expect(getWaitingFor(player).cards).has.length(5);
    expect(getWaitingFor(player).config.min).eq(0);
    expect(getWaitingFor(player2).cards).has.length(4);


    finishGeneration(game);
    expect(game.getGeneration()).to.eq(13);

    expect(getWaitingFor(player).cards).has.length(4);
    expect(getWaitingFor(player).config.min).eq(0);
    expect(getWaitingFor(player2).cards).has.length(4);
  });
});

function getWaitingFor(player: IPlayer): SelectCard<IProjectCard> {
  return cast(player.getWaitingFor(), SelectCard<IProjectCard>);
}
