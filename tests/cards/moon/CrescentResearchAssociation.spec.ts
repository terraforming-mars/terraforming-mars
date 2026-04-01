import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {testGame} from '../../TestGame';
import {setOxygenLevel} from '../../TestingUtils';
import {CrescentResearchAssociation} from '../../../src/server/cards/moon/CrescentResearchAssociation';
import {TestPlayer} from '../../TestPlayer';
import {MareNectarisMine} from '../../../src/server/cards/moon/MareNectarisMine';
import {Predators} from '../../../src/server/cards/base/Predators';
import {LunaTradeStation} from '../../../src/server/cards/moon/LunaTradeStation';

describe('CrescentResearchAssociation', () => {
  let player: TestPlayer;
  let game: IGame;
  let card: CrescentResearchAssociation;

  beforeEach(() => {
    [game, player] = testGame(1, {moonExpansion: true});
    card = new CrescentResearchAssociation();
  });

  it('effect', () => {
    // Cost 14, has a moon tag
    const mareNectarisMine = new MareNectarisMine();
    // Cost 14, has no moon tag.
    const predators = new Predators();

    // Additional card requirements.
    player.titanium = 1;
    setOxygenLevel(game, 14);

    player.cardsInHand = [mareNectarisMine, predators];
    player.playedCards.push(card);

    player.tagsForTest = {moon: 0};
    player.megaCredits = 14;
    expect(player.getPlayableCards()).has.members([mareNectarisMine, predators]);

    player.tagsForTest = {moon: 0};
    player.megaCredits = 13;
    expect(player.getPlayableCards()).is.empty;

    player.tagsForTest = {moon: 1};
    player.megaCredits = 13;
    expect(player.getPlayableCards()).has.members([mareNectarisMine]);

    player.tagsForTest = {moon: 1};
    player.megaCredits = 12;
    expect(player.getPlayableCards()).is.empty;

    player.tagsForTest = {moon: 2};
    player.megaCredits = 12;
    expect(player.getPlayableCards()).has.members([mareNectarisMine]);
  });

  it('Discount is doubled on cards with two moon tags', () => {
    player.tagsForTest = {moon: 2};
    const mareNectarisMine = new MareNectarisMine();
    expect(card.getCardDiscount(player, mareNectarisMine)).eq(2);
    const lunaTradeStation = new LunaTradeStation();
    expect(card.getCardDiscount(player, lunaTradeStation)).eq(4);
  });

  for (const run of [
    {tags: 0, expected: 0},
    {tags: 1, expected: 0},
    {tags: 2, expected: 0},
    {tags: 3, expected: 1},
    {tags: 4, expected: 1},
    {tags: 5, expected: 1},
    {tags: 6, expected: 2},
    {tags: 7, expected: 2},
    {tags: 8, expected: 2},
  ] as const) {
    it('getVictoryPoints ' + JSON.stringify(run), () => {
      player.playedCards.push(card);
      player.tagsForTest = {moon: run.tags};
      expect(card.getVictoryPoints(player)).eq(run.expected);
    });
  }
});

