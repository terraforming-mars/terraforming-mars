import {expect} from 'chai';
import {CorporateTheft} from '../../../src/server/cards/underworld/CorporateTheft';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {CardName} from '../../../src/common/cards/CardName';
import {newProjectCard} from '../../../src/server/createCard';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {assertIsMaybeBlock} from '../../underworld/underworldAssertions';

function toCard(e: readonly [CardName, number] | CardName) {
  const [cardName, count] = typeof(e) === 'string' ? [e, 0] : e;
  const card = newProjectCard(cardName)!;
  card.resourceCount = count;
  return card;
}

describe('CorporateTheft', () => {
  const canPlayRuns = [
    {corruption: 1, cards: [[CardName.TARDIGRADES, 1]], opponentCards: [], expected: false},
    {corruption: 2, cards: [[CardName.ANTS, 0]], opponentCards: [], expected: false},
    {corruption: 2, cards: [[CardName.TARDIGRADES, 1]], opponentCards: [], expected: false},
    {corruption: 2, cards: [], opponentCards: [[CardName.TARDIGRADES, 0]], expected: false},
    {corruption: 1, cards: [], opponentCards: [[CardName.TARDIGRADES, 1]], expected: false},
    {corruption: 2, cards: [], opponentCards: [[CardName.TARDIGRADES, 1]], expected: true},
  ] as const;
  for (const run of canPlayRuns) {
    it('can play ' + JSON.stringify(run), () => {
      const card = new CorporateTheft();
      const [/* game */, player, opponent] = testGame(2, {underworldExpansion: true});

      player.underworldData.corruption = run.corruption;

      player.playedCards = run.cards.map(toCard);
      opponent.playedCards = run.opponentCards.map(toCard);

      expect(card.canPlay(player)).eq(run.expected);
    });
  }

  const playRuns = [
    {player: {cards: [], corruption: 2},
      opponent: {cards: [[CardName.TARDIGRADES, 1]], corruption: 2},
      selection: CardName.TARDIGRADES, match: undefined, block: false},
    {player: {cards: [CardName.RUST_EATING_BACTERIA], corruption: 2},
      opponent: {cards: [[CardName.TARDIGRADES, 1]], corruption: 2},
      selection: CardName.TARDIGRADES, match: undefined, block: true},
    {player: {cards: [CardName.RUST_EATING_BACTERIA], corruption: 2},
      opponent: {cards: [[CardName.TARDIGRADES, 1]], corruption: 2},
      selection: CardName.TARDIGRADES, match: CardName.RUST_EATING_BACTERIA, block: false},
  ] as const;
  for (const run of playRuns) {
    it('play ' + JSON.stringify(run), () => {
      const card = new CorporateTheft();
      const [game, player, opponent] = testGame(2, {underworldExpansion: true});

      player.underworldData.corruption = run.player.corruption;
      opponent.underworldData.corruption = run.opponent.corruption;
      player.playedCards = run.player.cards.map(toCard);
      opponent.playedCards = run.opponent.cards.map(toCard);

      cast(card.play(player), undefined);
      runAllActions(game);
      const selectCard = cast(player.popWaitingFor(), SelectCard);

      const selected = opponent.getPlayedCard(run.selection)!;
      selectCard.cb([selected]);
      runAllActions(game);

      if (run.opponent.corruption > 0) {
        assertIsMaybeBlock(opponent, opponent.popWaitingFor(), run.block ? 'corruption' : 'do not block');
      }
      if (run.block === true) {
        expect(player.underworldData.corruption).eq(run.player.corruption + 1);
        expect(opponent.underworldData.corruption).eq(run.opponent.corruption - 1);

        runAllActions(game);
        expect(selected.resourceCount).eq(1);
      } else {
        expect(player.underworldData.corruption).eq(run.player.corruption);
        expect(opponent.underworldData.corruption).eq(run.opponent.corruption);

        runAllActions(game);

        if (run.match !== undefined) {
          // const selectCard = cast(player.popWaitingFor(), SelectCard);
          const playedCard = player.getPlayedCard(run.match)!;
          // selectCard.cb([playedCard]);
          expect(playedCard.resourceCount).eq(1);
        }
        expect(selected?.resourceCount).eq(0);
      }
    });
  }

  it('solo', () => {
    const card = new CorporateTheft();
    const [/* game */, player] = testGame(1, {underworldExpansion: true});

    player.underworldData.corruption = 1;
    expect(card.canPlay(player)).is.false;

    player.underworldData.corruption = 2;
    expect(card.canPlay(player)).is.true;

    cast(card.play(player), undefined);
    expect(player.underworldData.corruption).eq(3);
  });
});
