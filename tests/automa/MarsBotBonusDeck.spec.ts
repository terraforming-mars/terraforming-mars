import {expect} from 'chai';
import {BASE_BONUS_CARDS, MarsBotBonusDeck} from '../../src/server/automa/MarsBotBonusDeck';
import {SeededRandom} from '../../src/common/utils/Random';
import {createBonusCard} from '@/server/automa/bonusCards/MarsBotBonusCards';
import {BonusCardName} from '@/common/automa/BonusCardName';
import {toName} from '@/common/utils/utils';

describe('MarsBotBonusDeck', () => {
  const logger = {log: () => {}};
  let deck: MarsBotBonusDeck;

  beforeEach(() => {
    deck = MarsBotBonusDeck.create(new SeededRandom(42));
  });

  it('starts with the 8 base cards in the draw pile', () => {
    expect(deck.drawPile.length).to.eq(8);
    expect(deck.discardPile.length).to.eq(0);
  });

  for (const run of [
    {
      expansions: 'Venus Next',
      venus: true,
      colonies: false,
      expected: {
        removed: [BonusCardName.LOBBYISTS],
        added: [BonusCardName.LOBBYISTS_VENUS],
      },
    },
    {
      expansions: 'Colonies',
      venus: false,
      colonies: true,
      expected: {
        removed: [BonusCardName.EXPEDITED_CONSTRUCTION],
        added: [BonusCardName.EXPEDITED_CONSTRUCTION_COLONIES, BonusCardName.OUTER_SYSTEM_FOOTHOLD],
      },
    },
    {
      expansions: 'Venus Next and Colonies',
      venus: true,
      colonies: true,
      expected: {
        removed: [BonusCardName.EXPEDITED_CONSTRUCTION, BonusCardName.LOBBYISTS],
        added: [
          BonusCardName.LOBBYISTS_VENUS,
          BonusCardName.EXPEDITED_CONSTRUCTION_COLONIES,
          BonusCardName.OUTER_SYSTEM_FOOTHOLD,
        ],
      },
    },
  ]) {
    it('swaps cards in the ' + run.expansions + ' deck', () => {
      const expected = BASE_BONUS_CARDS
        .filter((name) => !run.expected.removed.some((removed) => removed === name))
        .concat(run.expected.added);

      const expansionDeck = MarsBotBonusDeck.create(new SeededRandom(42), {venus: run.venus, colonies: run.colonies});

      const drawnNames = expansionDeck.drawPile.map(toName);
      expect(drawnNames).to.have.members(expected);
      expect(expansionDeck.discardPile).to.be.empty;
    });
  }

  it('serialization round trip', () => {
    deck.discard(deck.draw(logger)!, deck.draw(logger)!);
    const restored = MarsBotBonusDeck.deserialize(deck.serialize(), new SeededRandom(42));
    expect(restored.drawPile).to.deep.eq(deck.drawPile);
    expect(restored.discardPile).to.deep.eq(deck.discardPile);
  });

  it('serialization round trip with expansion and corporation bonus cards', () => {
    const names = [
      BonusCardName.LOBBYISTS_VENUS,
      BonusCardName.GOVERNMENT_INTERVENTION,
      BonusCardName.EXPEDITED_CONSTRUCTION_COLONIES,
      BonusCardName.OUTER_SYSTEM_FOOTHOLD,
      BonusCardName.SHIPPING_LINES,
      BonusCardName.EXTENDED_SHIPPING_LINES,
      BonusCardName.PARTY_POLITICS,
      BonusCardName.SETTLERS,
      BonusCardName.RAPID_SPROUTING,
      BonusCardName.SUPPLY_AND_DEMAND,
      BonusCardName.DO_IT_RIGHT,
      BonusCardName.VENUSIAN_LOBBY,
      BonusCardName.BUILD_BUILD_BUILD,
      BonusCardName.DIVERSIFICATION,
      BonusCardName.GRAY_EMINENCE,
      BonusCardName.INTERFACE_HYPERLINK,
      BonusCardName.GOVERNMENT_SUBSIDY,
      BonusCardName.INVESTORS,
    ];
    const expansionDeck = new MarsBotBonusDeck(names.map(createBonusCard), [], new SeededRandom(42));
    expansionDeck.discard(expansionDeck.draw(logger)!, expansionDeck.draw(logger)!);

    const restored = MarsBotBonusDeck.deserialize(expansionDeck.serialize(), new SeededRandom(42));

    expect(restored.drawPile).to.deep.eq(expansionDeck.drawPile);
    expect(restored.discardPile).to.deep.eq(expansionDeck.discardPile);
    const restoredNames = [...restored.drawPile, ...restored.discardPile].map(toName);
    expect(restoredNames).to.have.members(names);
  });
});
