import {expect} from 'chai';
import {MarsBotBonusDeck} from '../../src/server/automa/MarsBotBonusDeck';
import {SeededRandom} from '../../src/common/utils/Random';
import {createBaseBonusCards, createBonusCard} from '../../src/server/automa/bonusCards/MarsBotBonusCards';
import {BonusCardId} from '../../src/common/automa/AutomaTypes';
import {MeteorShower} from '../../src/server/automa/bonusCards/MeteorShower';
import {testGame} from '../TestGame';
import {recordingMarsBot} from './corps/RecordingMarsBot';

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
        removed: [BonusCardId.B06_LOBBYISTS],
        added: [BonusCardId.B15_LOBBYISTS_VENUS],
      },
    },
    {
      expansions: 'Colonies',
      venus: false,
      colonies: true,
      expected: {
        removed: [BonusCardId.B05_EXPEDITED_CONSTRUCTION],
        added: [BonusCardId.B17_EXPEDITED_CONSTRUCTION_COLONIES, BonusCardId.B18_OUTER_SYSTEM_FOOTHOLD],
      },
    },
    {
      expansions: 'Venus Next and Colonies',
      venus: true,
      colonies: true,
      expected: {
        removed: [BonusCardId.B05_EXPEDITED_CONSTRUCTION, BonusCardId.B06_LOBBYISTS],
        added: [
          BonusCardId.B15_LOBBYISTS_VENUS,
          BonusCardId.B17_EXPEDITED_CONSTRUCTION_COLONIES,
          BonusCardId.B18_OUTER_SYSTEM_FOOTHOLD,
        ],
      },
    },
  ]) {
    it('swaps cards in the ' + run.expansions + ' deck', () => {
      const expected = createBaseBonusCards()
        .map((card) => card.id)
        .filter((id) => !run.expected.removed.includes(id))
        .concat(run.expected.added);

      const expansionDeck = MarsBotBonusDeck.create(new SeededRandom(42), {venus: run.venus, colonies: run.colonies});

      expect(expansionDeck.drawPile.map((card) => card.id)).to.have.members(expected);
      expect(expansionDeck.discardPile).to.be.empty;
    });
  }

  it('a drawn card resolves through its own class', () => {
    const [game, human, botPlayer] = testGame(2);
    const {marsBot} = recordingMarsBot({game, player: botPlayer, humanPlayer: human});
    human.plants = 4;
    const meteorShower = MarsBotBonusDeck.create(new SeededRandom(42)).drawPile.find((card) => card.id === BonusCardId.B01_METEOR_SHOWER);

    const destroyed = meteorShower?.resolve(marsBot);

    expect(meteorShower).instanceOf(MeteorShower);
    expect(human.plants).eq(0);
    expect(destroyed).is.true;
  });

  it('serialization round trip', () => {
    deck.discard(deck.draw(logger)!, deck.draw(logger)!);
    const restored = MarsBotBonusDeck.deserialize(deck.serialize(), new SeededRandom(42));
    expect(restored.drawPile).to.deep.eq(deck.drawPile);
    expect(restored.discardPile).to.deep.eq(deck.discardPile);
    expect(restored.drawPile.map((card) => card.constructor)).deep.eq(deck.drawPile.map((card) => card.constructor));
    expect(restored.discardPile.map((card) => card.constructor)).deep.eq(deck.discardPile.map((card) => card.constructor));
  });

  it('serialization round trip with expansion and corporation bonus cards', () => {
    const ids = Object.values(BonusCardId).filter((id) => id >= BonusCardId.B15_LOBBYISTS_VENUS);
    const expansionDeck = new MarsBotBonusDeck(ids.map((id) => createBonusCard(id)), [], new SeededRandom(42));
    expansionDeck.discard(expansionDeck.draw(logger)!, expansionDeck.draw(logger)!);

    const restored = MarsBotBonusDeck.deserialize(expansionDeck.serialize(), new SeededRandom(42));

    expect(restored.drawPile).to.deep.eq(expansionDeck.drawPile);
    expect(restored.discardPile).to.deep.eq(expansionDeck.discardPile);
    expect([...restored.drawPile, ...restored.discardPile].map((card) => card.id)).to.have.members(ids);
  });
});
