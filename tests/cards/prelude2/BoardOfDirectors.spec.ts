import {expect} from 'chai';
import {BoardOfDirectors} from '../../../src/server/cards/prelude2/BoardOfDirectors';
import {testGame} from '../../TestGame';
import {Units} from '../../../src/common/Units';
import {cast, runAllActions} from '../../TestingUtils';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {Loan} from '../../../src/server/cards/prelude/Loan';

describe('BoardOfDirectors', () => {
  it('play', () => {
    const card = new BoardOfDirectors();
    const [game, player] = testGame(1, {prelude2Expansion: true});

    card.play(player);
    runAllActions(game);
    expect(card.resourceCount).eq(4);
  });

  const canActRuns = [
    {preludeDeck: 0, resources: 0, expected: false},
    {preludeDeck: 1, resources: 0, expected: false},
    {preludeDeck: 0, resources: 1, expected: false},
    {preludeDeck: 1, resources: 1, expected: true},
  ] as const;
  for (const run of canActRuns) {
    it('canAct: ' + JSON.stringify(run), () => {
      const card = new BoardOfDirectors();
      const [game, player] = testGame(1, {preludeExtension: true});

      game.preludeDeck.drawPile.length = run.preludeDeck;
      card.resourceCount = run.resources;

      expect(card.canAct(player)).eq(run.expected);
    });
  }

  it('action, can afford', () => {
    const card = new BoardOfDirectors();
    const [game, player] = testGame(1, {preludeExtension: true});

    const loan = new Loan();
    game.preludeDeck.drawPile.push(loan);
    card.resourceCount = 1;
    expect(card.canAct(player)).eq(true);

    player.megaCredits = 15;
    const selectCard = cast(card.action(player), SelectCard);
    const prelude = selectCard.cards[0];

    expect(prelude).eq(loan);

    selectCard.cb([prelude]);
    runAllActions(game);

    expect(player.playedCards).contains(loan);
    expect(card.resourceCount).eq(0);
    expect(player.megaCredits).eq(33);
    expect(player.production.megacredits).eq(-2);
  });

  it('action, can afford, fizzle', () => {
    const card = new BoardOfDirectors();
    const [game, player] = testGame(1, {preludeExtension: true});

    const loan = new Loan();
    game.preludeDeck.drawPile.push(loan);
    card.resourceCount = 1;
    expect(card.canAct(player)).eq(true);

    player.megaCredits = 15;
    player.production.adjust(Units.of({megacredits: -4}));
    const selectCard = cast(card.action(player), SelectCard);
    const prelude = selectCard.cards[0];

    expect(prelude).eq(loan);

    selectCard.cb([prelude]);
    runAllActions(game);

    expect(player.playedCards).does.not.contain(loan);
    expect(game.preludeDeck.discardPile).contains(loan);
    expect(card.resourceCount).eq(0);
    expect(player.megaCredits).eq(18);
    expect(player.production.megacredits).eq(-4);
  });

  it('action, cannot afford, discard', () => {
    const card = new BoardOfDirectors();
    const [game, player] = testGame(1, {preludeExtension: true});

    const loan = new Loan();
    game.preludeDeck.drawPile.push(loan);
    card.resourceCount = 1;
    expect(card.canAct(player)).eq(true);

    player.megaCredits = 11;
    cast(card.action(player), undefined);

    runAllActions(game);

    expect(player.playedCards).does.not.contain(loan);
    expect(game.preludeDeck.discardPile).contains(loan);
    expect(card.resourceCount).eq(1);
    expect(player.megaCredits).eq(11);
    expect(player.production.megacredits).eq(0);
  });

  it('action, can afford, decline', () => {
    const card = new BoardOfDirectors();
    const [game, player] = testGame(1, {preludeExtension: true});

    card.resourceCount = 1;
    expect(card.canAct(player)).eq(true);

    player.megaCredits = 15;
    const selectCard = cast(card.action(player), SelectCard);
    const prelude = selectCard.cards[0];
    selectCard.cb([]);
    runAllActions(game);

    expect(player.playedCards).does.not.contain(prelude);
    expect(game.preludeDeck.discardPile).contains(prelude);
    expect(card.resourceCount).eq(1);
    expect(player.megaCredits).eq(15);
  });
});
