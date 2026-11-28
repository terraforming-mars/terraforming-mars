import {expect} from 'chai';
import {BonusCardName} from '@/common/automa/BonusCardName';
import {Tag} from '@/common/cards/Tag';
import {ConstRandom, SeededRandom} from '@/common/utils/Random';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {MarsBotActionDeck} from '@/server/automa/MarsBotActionDeck';
import {MarsBotBonusCard} from '@/server/automa/bonusCards/MarsBotBonusCard';
import {MarsBotBonusDeck} from '@/server/automa/MarsBotBonusDeck';
import {cardTagsIncludingEvent} from '@/server/automa/MarsBotTags';
import {ACTION_DECK_BONUS_CARD_REMOVED} from '@/server/automa/corps/corpHelpers';
import {Algae} from '@/server/cards/base/Algae';
import {Asteroid} from '@/server/cards/base/Asteroid';
import {Mine} from '@/server/cards/base/Mine';
import {IProjectCard} from '@/server/cards/IProjectCard';
import {GameOptions} from '@/server/game/GameOptions';
import {testGame} from '../TestGame';
import {recordingMarsBot} from './corps/RecordingMarsBot';

/** A bonus card that runs `effect` when it resolves, and returns `destroyed`. */
class TestBonusCard extends MarsBotBonusCard {
  constructor(
    name: BonusCardName,
    private readonly destroyed: boolean = false,
    private readonly effect: (marsBot: IMarsBot) => void = () => {},
  ) {
    super(name);
  }

  public override resolve(marsBot: IMarsBot): boolean {
    this.effect(marsBot);
    return this.destroyed;
  }
}

/**
 * Builds an action deck on a bot with an empty bonus deck.
 *
 * A random insert goes on top, at index 0.
 */
function setup(options: Partial<GameOptions> = {}, fields: Partial<IMarsBot> = {}) {
  const [game, human, botPlayer] = testGame(2, options);
  const played: Array<string> = [];
  const {marsBot, corpState} = recordingMarsBot({
    game,
    player: botPlayer,
    humanPlayer: human,
    bonusDeck: new MarsBotBonusDeck([], [], new SeededRandom(0)),
    actionDeckBonusCard: undefined,
    replacesPartyPolitics: false,
    hasSecondTradeFleet: false,
    resolveProjectCard: (card) => played.push(card.name),
    ...fields,
  });
  const deck = new MarsBotActionDeck(marsBot, new ConstRandom(0));
  return {game, marsBot, corpState, played, deck};
}

function bonusIds(cards: ReadonlyArray<IProjectCard | MarsBotBonusCard>): Array<BonusCardName> {
  return cards.flatMap((card) => card instanceof MarsBotBonusCard ? [card.name] : []);
}

function projectCardCount(cards: ReadonlyArray<IProjectCard | MarsBotBonusCard>): number {
  return cards.filter((card) => !(card instanceof MarsBotBonusCard)).length;
}

describe('MarsBotActionDeck', () => {
  for (const run of [
    {preludeExtension: false, expected: {projectCards: 3, bonusCards: [BonusCardName.METEOR_SHOWER]}},
    {preludeExtension: true, expected: {projectCards: 6, bonusCards: [BonusCardName.METEOR_SHOWER]}},
  ]) {
    it('builds the first action deck from project cards and a bonus card: ' + JSON.stringify(run), () => {
      const {marsBot, deck} = setup({preludeExtension: run.preludeExtension});
      marsBot.bonusDeck.drawPile.push(new TestBonusCard(BonusCardName.METEOR_SHOWER));

      deck.buildInitial();

      const actual = {projectCards: projectCardCount(deck.cards), bonusCards: bonusIds(deck.cards)};
      expect(actual).deep.eq(run.expected);
    });
  }

  for (const run of [
    {options: {venusNextExtension: true}, replacesPartyPolitics: false, expected: [BonusCardName.GOVERNMENT_INTERVENTION]},
    {options: {turmoilExtension: true}, replacesPartyPolitics: false, expected: [BonusCardName.PARTY_POLITICS]},
    {options: {turmoilExtension: true}, replacesPartyPolitics: true, expected: []},
  ]) {
    it("adds the expansions' cards to the first action deck: " + JSON.stringify(run), () => {
      const {deck} = setup(run.options, {replacesPartyPolitics: run.replacesPartyPolitics});

      deck.buildInitial();

      expect(bonusIds(deck.cards)).deep.eq(run.expected);
    });
  }

  it('builds the next action deck from 3 project cards and a bonus card', () => {
    const {marsBot, deck} = setup();
    marsBot.bonusDeck.drawPile.push(new TestBonusCard(BonusCardName.METEOR_SHOWER));

    deck.buildResearch();

    const actual = {projectCards: projectCardCount(deck.cards), bonusCards: bonusIds(deck.cards)};
    expect(actual).deep.eq({projectCards: 3, bonusCards: [BonusCardName.METEOR_SHOWER]});
  });

  for (const run of [
    {options: {venusNextExtension: true}, generation: 2, fields: {}, expected: [BonusCardName.GOVERNMENT_INTERVENTION]},
    {options: {turmoilExtension: true}, generation: 2, fields: {}, expected: [BonusCardName.PARTY_POLITICS]},
    {options: {turmoilExtension: true}, generation: 2, fields: {replacesPartyPolitics: true}, expected: []},
    {options: {coloniesExtension: true}, generation: 1, fields: {}, expected: []},
    {options: {coloniesExtension: true}, generation: 2, fields: {}, expected: [BonusCardName.SHIPPING_LINES]},
    {options: {coloniesExtension: true}, generation: 2, fields: {hasSecondTradeFleet: true},
      expected: [BonusCardName.SHIPPING_LINES, BonusCardName.EXTENDED_SHIPPING_LINES]},
  ]) {
    it("adds the expansions' cards to the next action deck: " + JSON.stringify(run), () => {
      const {game, deck} = setup(run.options, run.fields);
      game.generation = run.generation;

      deck.buildResearch();

      expect(bonusIds(deck.cards)).to.have.members(run.expected);
    });
  }

  for (const run of [
    {skipDiscard: false, expected: {projectCards: 3, discarded: 1}},
    {skipDiscard: true, expected: {projectCards: 4, discarded: 0}},
  ]) {
    it('builds the next action deck from the drafted cards, less one: ' + JSON.stringify(run), () => {
      const {game, deck} = setup({turmoilExtension: true});
      const discarded = game.projectDeck.discardPile.length;

      deck.buildResearchFromDraft([new Mine(), new Algae(), new Asteroid(), new Mine()], run.skipDiscard);

      const actual = {
        projectCards: projectCardCount(deck.cards),
        discarded: game.projectDeck.discardPile.length - discarded,
      };
      expect(actual).deep.eq(run.expected);
      expect(bonusIds(deck.cards)).deep.eq([BonusCardName.PARTY_POLITICS]);
    });
  }

  it('plays a project card from the top of the action deck', () => {
    const {deck, played} = setup();
    deck.cards = [new Mine(), new TestBonusCard(BonusCardName.METEOR_SHOWER)];

    deck.playTopCard();

    expect(played).deep.eq(['Mine']);
    expect(projectCardCount(deck.cards)).eq(0);
    expect(bonusIds(deck.cards)).deep.eq([BonusCardName.METEOR_SHOWER]);
  });

  it('plays a bonus card from the top of the action deck', () => {
    const {marsBot, deck} = setup();
    let resolved = 0;
    deck.cards = [new TestBonusCard(BonusCardName.METEOR_SHOWER, false, () => resolved++)];

    deck.playTopCard();

    expect(resolved).eq(1);
    expect(bonusIds(marsBot.bonusDeck.discardPile)).deep.eq([BonusCardName.METEOR_SHOWER]);
  });

  it('plays nothing from an empty action deck', () => {
    const {marsBot, deck, played} = setup();

    deck.playTopCard();

    expect(played).is.empty;
    expect(marsBot.bonusDeck.discardPile).is.empty;
  });

  for (const run of [
    {name: 'kept', card: BonusCardName.METEOR_SHOWER, destroyed: false, backInDeck: false,
      expected: {discarded: [BonusCardName.METEOR_SHOWER], destroyedBonusCards: 0, removed: 0}},
    {name: 'destroyed', card: BonusCardName.METEOR_SHOWER, destroyed: true, backInDeck: false,
      expected: {discarded: [], destroyedBonusCards: 1, removed: 0}},
    {name: 'shuffled back', card: BonusCardName.METEOR_SHOWER, destroyed: true, backInDeck: true,
      expected: {discarded: [], destroyedBonusCards: 0, removed: 0}},
    {name: 'set aside', card: BonusCardName.GOVERNMENT_INTERVENTION, destroyed: false, backInDeck: false,
      expected: {discarded: [], destroyedBonusCards: 0, removed: 0}},
    {name: 'corp card kept', card: BonusCardName.RAPID_SPROUTING, destroyed: false, backInDeck: false,
      expected: {discarded: [], destroyedBonusCards: 0, removed: 0}},
    {name: 'corp card destroyed', card: BonusCardName.RAPID_SPROUTING, destroyed: true, backInDeck: false,
      expected: {discarded: [], destroyedBonusCards: 1, removed: 1}},
  ]) {
    it('puts a resolved bonus card where it goes next: ' + JSON.stringify(run), () => {
      const {marsBot, corpState, deck} = setup({}, {actionDeckBonusCard: BonusCardName.RAPID_SPROUTING});
      const card = new TestBonusCard(run.card, run.destroyed, (bot) => {
        if (run.backInDeck) {
          bot.bonusDeck.drawPile.push(card);
        }
      });

      expect(deck.playBonusCard(card)).eq(run.destroyed);
      const actual = {
        discarded: bonusIds(marsBot.bonusDeck.discardPile),
        destroyedBonusCards: deck.destroyedBonusCards,
        removed: corpState.get(ACTION_DECK_BONUS_CARD_REMOVED) ?? 0,
      };
      expect(actual).deep.eq(run.expected);
    });
  }

  it('plays a project card drawn from the bonus deck', () => {
    const {marsBot, deck, played} = setup();

    deck.playBonusCard(new Mine());

    expect(played).deep.eq(['Mine']);
    expect(marsBot.bonusDeck.discardPile).is.empty;
  });

  it('moves the top bonus card into the action deck', () => {
    const {marsBot, deck} = setup();
    marsBot.bonusDeck.drawPile.push(
      new TestBonusCard(BonusCardName.INVASIVE_SPECIES),
      new TestBonusCard(BonusCardName.METEOR_SHOWER),
    );
    deck.cards = [new Mine()];

    deck.maybeMoveBonusCardToActionDeck();
    deck.maybeMoveBonusCardToActionDeck();
    deck.maybeMoveBonusCardToActionDeck();

    const expected = [BonusCardName.INVASIVE_SPECIES, BonusCardName.METEOR_SHOWER];
    expect(bonusIds(deck.cards)).deep.eq(expected);
    expect(projectCardCount(deck.cards)).eq(1);
  });

  it('returns the setup bonus card to the bonus deck, keeping project cards and the cards that come back every generation', () => {
    const {marsBot, deck} = setup({}, {actionDeckBonusCard: BonusCardName.RAPID_SPROUTING});
    deck.cards = [
      new Mine(),
      new TestBonusCard(BonusCardName.METEOR_SHOWER),
      new TestBonusCard(BonusCardName.GOVERNMENT_INTERVENTION),
      new TestBonusCard(BonusCardName.RAPID_SPROUTING),
    ];

    deck.returnSetupBonusCardToBonusDeck();

    const expectedKept = [BonusCardName.GOVERNMENT_INTERVENTION, BonusCardName.RAPID_SPROUTING];
    expect(bonusIds(deck.cards)).deep.eq(expectedKept);
    expect(projectCardCount(deck.cards)).eq(1);
    expect(bonusIds(marsBot.bonusDeck.drawPile)).deep.eq([BonusCardName.METEOR_SHOWER]);
  });

  it('draws project cards into the action deck', () => {
    const {game, deck} = setup();
    const top = game.projectDeck.drawPile[game.projectDeck.drawPile.length - 1];

    deck.drawProjectCards(2);

    expect(deck.cards).has.length(2);
    expect(deck.cards).includes(top);
  });

  for (const run of [
    {name: 'in the bonus draw pile', where: 'draw', removed: 0, expected: {added: true, bonusDeck: 0}},
    {name: 'in the bonus discard pile', where: 'discard', removed: 0, expected: {added: true, bonusDeck: 0}},
    {name: 'nowhere', where: 'none', removed: 0, expected: {added: true, bonusDeck: 0}},
    {name: 'in the action deck', where: 'action', removed: 0, expected: {added: false, bonusDeck: 0}},
    {name: 'removed from the game', where: 'none', removed: 1, expected: {added: false, bonusDeck: 0}},
  ]) {
    it('shuffles a bonus card into the action deck once: ' + JSON.stringify(run), () => {
      const {marsBot, corpState, deck} = setup({}, {actionDeckBonusCard: BonusCardName.METEOR_SHOWER});
      const card = new TestBonusCard(BonusCardName.METEOR_SHOWER);
      if (run.where === 'draw') {
        marsBot.bonusDeck.drawPile.push(card);
      } else if (run.where === 'discard') {
        marsBot.bonusDeck.discardPile.push(card);
      } else if (run.where === 'action') {
        deck.cards.push(card);
      }
      corpState.set(ACTION_DECK_BONUS_CARD_REMOVED, run.removed);

      const added = deck.addBonusCard(BonusCardName.METEOR_SHOWER);

      const actual = {
        added: added !== undefined,
        bonusDeck: marsBot.bonusDeck.drawPile.length + marsBot.bonusDeck.discardPile.length,
      };
      const expectedInDeck = run.removed === 0 ? [BonusCardName.METEOR_SHOWER] : [];
      expect(actual).deep.eq(run.expected);
      expect(bonusIds(deck.cards)).deep.eq(expectedInDeck);
      if (run.where === 'draw' || run.where === 'discard') {
        expect(added).eq(card);
      }
    });
  }

  it('removes a bonus card from the bonus deck', () => {
    const {marsBot, deck} = setup();
    marsBot.bonusDeck.drawPile.push(
      new TestBonusCard(BonusCardName.INVASIVE_SPECIES),
      new TestBonusCard(BonusCardName.METEOR_SHOWER),
    );
    marsBot.bonusDeck.discardPile.push(new TestBonusCard(BonusCardName.METEOR_SHOWER));

    deck.removeBonusCard(BonusCardName.METEOR_SHOWER);

    expect(bonusIds(marsBot.bonusDeck.drawPile)).deep.eq([BonusCardName.INVASIVE_SPECIES]);
    expect(marsBot.bonusDeck.discardPile).is.empty;
    expect(deck.cards).is.empty;
  });

  for (const run of [
    {dealt: BonusCardName.METEOR_SHOWER, expected: [BonusCardName.INVASIVE_SPECIES]},
    {dealt: BonusCardName.PARTY_POLITICS, expected: []},
  ]) {
    it('replaces a removed setup bonus card from the bonus deck, but not a card that comes back every generation: ' + JSON.stringify(run), () => {
      const {marsBot, deck} = setup();
      marsBot.bonusDeck.drawPile.push(new TestBonusCard(BonusCardName.INVASIVE_SPECIES));
      deck.cards = [new Mine(), new TestBonusCard(run.dealt)];

      deck.removeBonusCard(run.dealt);

      expect(bonusIds(deck.cards)).deep.eq(run.expected);
    });
  }

  it('shuffles project cards with a tag into the bonus deck', () => {
    const {marsBot, deck} = setup();

    deck.addProjectCardsToBonusDeck(Tag.SPACE, 2);

    const cards = marsBot.bonusDeck.drawPile;
    const allSpaceProjectCards = cards.every((card) => !(card instanceof MarsBotBonusCard) && cardTagsIncludingEvent(card).includes(Tag.SPACE));
    expect(cards).has.length(2);
    expect(allSpaceProjectCards).is.true;
  });

  it('shuffles a bonus card into the bonus deck, or puts it at the bottom', () => {
    const {marsBot, deck} = setup();
    marsBot.bonusDeck.drawPile.push(new TestBonusCard(BonusCardName.RESEARCH_AND_DEVELOPMENT));

    deck.addBonusCardToBonusDeck(BonusCardName.METEOR_SHOWER);
    marsBot.bonusDeck.drawPile.push(new TestBonusCard(BonusCardName.LOCAL_NEURAL_INSTANCE));
    deck.addBonusCardToBottomOfBonusDeck(BonusCardName.INVASIVE_SPECIES);

    // The top of the bonus deck is the end of the draw pile
    expect(bonusIds(marsBot.bonusDeck.drawPile)).deep.eq([
      BonusCardName.INVASIVE_SPECIES,
      BonusCardName.METEOR_SHOWER,
      BonusCardName.RESEARCH_AND_DEVELOPMENT,
      BonusCardName.LOCAL_NEURAL_INSTANCE,
    ]);
  });

  it('discards the first project card with the fewest tags from the action deck', () => {
    const {game, deck} = setup();
    const asteroid = new Asteroid();
    const bonusCard = new TestBonusCard(BonusCardName.METEOR_SHOWER);
    const mine = new Mine();
    const algae = new Algae();
    deck.cards = [asteroid, bonusCard, mine, algae];

    deck.maybeDiscardProjectCardWithFewestTags();

    expect(deck.cards).deep.eq([asteroid, bonusCard, algae]);
    expect(game.projectDeck.discardPile).includes(mine);
  });

  it('discards no bonus card', () => {
    const {deck} = setup();
    deck.cards = [new TestBonusCard(BonusCardName.METEOR_SHOWER)];

    deck.maybeDiscardProjectCardWithFewestTags();

    expect(deck.cards).has.length(1);
  });

  for (const run of [
    {destroyedBonusCards: 0, expected: {actionDeckCardNames: ['Mine', 'Meteor Shower']}},
    {destroyedBonusCards: 2, expected: {actionDeckCardNames: ['Mine', 'Meteor Shower'], destroyedBonusCards: 2}},
  ]) {
    it('saves and restores the action deck and the destroyed bonus card count: ' + JSON.stringify(run), () => {
      const {deck, marsBot} = setup();
      deck.cards = [new Mine(), new TestBonusCard(BonusCardName.METEOR_SHOWER)];
      deck.destroyedBonusCards = run.destroyedBonusCards;
      const restored = new MarsBotActionDeck(marsBot, new ConstRandom(0));

      restored.restore(deck.serialize());

      expect(deck.serialize()).deep.eq(run.expected);
      expect(restored.serialize()).deep.eq(run.expected);
      expect(bonusIds(restored.cards)).deep.eq([BonusCardName.METEOR_SHOWER]);
    });
  }
});
