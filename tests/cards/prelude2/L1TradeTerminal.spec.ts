import {expect} from 'chai';
import {L1TradeTerminal} from '../../../src/server/cards/prelude2/L1TradeTerminal';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {CardName} from '../../../src/common/cards/CardName';
import {cardsFromJSON} from '../../../src/server/createCard';
import {SelfReplicatingRobots} from '../../../src/server/cards/promo/SelfReplicatingRobots';
import {toName, zip} from '../../../src/common/utils/utils';

describe('L1TradeTerminal', () => {
  let card: L1TradeTerminal;
  let player: TestPlayer;

  beforeEach(() => {
    card = new L1TradeTerminal();
    [/* game */, player] = testGame(2, {coloniesExtension: true});
  });

  const playRuns = [
    {cards: [CardName.AERIAL_MAPPERS, CardName.ANTHOZOA, CardName.ANTS, CardName.TARDIGRADES], counts: [0, 0, 0, 0], expected: [0, 0, 0, 0]},
    {cards: [CardName.AERIAL_MAPPERS, CardName.ANTHOZOA, CardName.ANTS, CardName.TARDIGRADES], counts: [1, 1, 0, 0], expected: [2, 2, 0, 0]},
    {cards: [CardName.AERIAL_MAPPERS, CardName.ANTHOZOA, CardName.ANTS, CardName.TARDIGRADES], counts: [1, 1, 0, 1], expected: [2, 2, 0, 2]},
  ] as const;
  for (const run of playRuns) {
    it('play ' + JSON.stringify(run), () => {
      const cards = cardsFromJSON(run.cards);
      player.playedCards.push(...cards);
      zip(cards, run.counts).forEach(([card, count]) => card.resourceCount = count);

      cast(card.play(player), undefined);

      expect(cards.map((card) => card.resourceCount)).deep.eq(run.expected);
    });
  }

  it('include Self-Replicating Robots', () => {
    const srr = new SelfReplicatingRobots();
    player.playedCards.push(srr);

    const cards = cardsFromJSON([CardName.AERIAL_MAPPERS, CardName.ANTHOZOA, CardName.ANTS, CardName.TARDIGRADES]);
    srr.targetCards.push(...cards);

    cards[2].resourceCount = 1;

    cast(card.play(player), undefined);

    expect(cards[2].resourceCount).eq(2);
  });

  it('more than 3 candidates', () => {
    const [aerialMappers, anthozoa, ants, tardigrades, appliedScience] = cardsFromJSON([CardName.AERIAL_MAPPERS, CardName.ANTHOZOA, CardName.ANTS, CardName.TARDIGRADES, CardName.APPLIED_SCIENCE]);
    player.playedCards.push(aerialMappers, anthozoa, ants, tardigrades, appliedScience);
    // Every card except Tardigrades has a resource.
    aerialMappers.resourceCount = 1;
    anthozoa.resourceCount = 1;
    ants.resourceCount = 1;
    tardigrades.resourceCount = 0;
    appliedScience.resourceCount = 1;

    const selectCard = cast(card.play(player), SelectCard);

    expect(selectCard.cards.map(toName)).deep.eq([CardName.AERIAL_MAPPERS, CardName.ANTHOZOA, CardName.ANTS, CardName.APPLIED_SCIENCE]);

    selectCard.cb([aerialMappers, ants, appliedScience]);

    expect(aerialMappers.resourceCount).eq(2);
    expect(anthozoa.resourceCount).eq(1);
    expect(ants.resourceCount).eq(2);
    expect(tardigrades.resourceCount).eq(0);
    expect(appliedScience.resourceCount).eq(2);
  });
});
