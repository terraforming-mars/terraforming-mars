import {expect} from 'chai';
import {BonusCardId} from '@/common/automa/AutomaTypes';
import {Tag} from '@/common/cards/Tag';
import {ConstRandom, SeededRandom} from '@/common/utils/Random';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {MarsBotActionDeck} from '@/server/automa/MarsBotActionDeck';
import {MarsBotBonusCard} from '@/server/automa/MarsBotBonusCard';
import {MarsBotBonusDeck} from '@/server/automa/MarsBotBonusDeck';
import {cardTagsIncludingEvent} from '@/server/automa/MarsBotTags';
import {createBonusCard} from '@/server/automa/bonusCards/MarsBotBonusCards';
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
  constructor(id: BonusCardId, private readonly destroyed: boolean = false, private readonly effect: (marsBot: IMarsBot) => void = () => {}) {
    super({id, name: createBonusCard(id).name});
  }

  public override resolve(marsBot: IMarsBot): boolean {
    this.effect(marsBot);
    return this.destroyed;
  }
}

/** An action deck on a bot with an empty bonus deck. A random insert goes on top, at index 0. */
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

function bonusIds(cards: ReadonlyArray<IProjectCard | MarsBotBonusCard>): Array<BonusCardId> {
  return cards.flatMap((card) => card instanceof MarsBotBonusCard ? [card.id] : []);
}

function projectCardCount(cards: ReadonlyArray<IProjectCard | MarsBotBonusCard>): number {
  return cards.filter((card) => !(card instanceof MarsBotBonusCard)).length;
}

describe('MarsBotActionDeck', () => {
  for (const run of [
    {preludeExtension: false, expected: {projectCards: 3, bonusCards: [BonusCardId.B01_METEOR_SHOWER]}},
    {preludeExtension: true, expected: {projectCards: 6, bonusCards: [BonusCardId.B01_METEOR_SHOWER]}},
  ]) {
    it('builds the first action deck from project cards and a bonus card: ' + JSON.stringify(run), () => {
      const {marsBot, deck} = setup({preludeExtension: run.preludeExtension});
      marsBot.bonusDeck.drawPile.push(new TestBonusCard(BonusCardId.B01_METEOR_SHOWER));

      deck.buildInitial();

      expect({projectCards: projectCardCount(deck.cards), bonusCards: bonusIds(deck.cards)}).deep.eq(run.expected);
    });
  }

  for (const run of [
    {options: {venusNextExtension: true}, replacesPartyPolitics: false, expected: [BonusCardId.B16_GOVERNMENT_INTERVENTION]},
    {options: {turmoilExtension: true}, replacesPartyPolitics: false, expected: [BonusCardId.B21_PARTY_POLITICS]},
    {options: {turmoilExtension: true}, replacesPartyPolitics: true, expected: []},
  ]) {
    it('adds the expansions\' cards to the first action deck: ' + JSON.stringify(run), () => {
      const {deck} = setup(run.options, {replacesPartyPolitics: run.replacesPartyPolitics});

      deck.buildInitial();

      expect(bonusIds(deck.cards)).deep.eq(run.expected);
    });
  }

  it('builds the next action deck from 3 project cards and a bonus card', () => {
    const {marsBot, deck} = setup();
    marsBot.bonusDeck.drawPile.push(new TestBonusCard(BonusCardId.B01_METEOR_SHOWER));

    deck.buildResearch();

    expect({projectCards: projectCardCount(deck.cards), bonusCards: bonusIds(deck.cards)})
      .deep.eq({projectCards: 3, bonusCards: [BonusCardId.B01_METEOR_SHOWER]});
  });

  for (const run of [
    {options: {venusNextExtension: true}, generation: 2, fields: {}, expected: [BonusCardId.B16_GOVERNMENT_INTERVENTION]},
    {options: {turmoilExtension: true}, generation: 2, fields: {}, expected: [BonusCardId.B21_PARTY_POLITICS]},
    {options: {turmoilExtension: true}, generation: 2, fields: {replacesPartyPolitics: true}, expected: []},
    {options: {coloniesExtension: true}, generation: 1, fields: {}, expected: []},
    {options: {coloniesExtension: true}, generation: 2, fields: {}, expected: [BonusCardId.B19_SHIPPING_LINES]},
    {options: {coloniesExtension: true}, generation: 2, fields: {hasSecondTradeFleet: true},
      expected: [BonusCardId.B19_SHIPPING_LINES, BonusCardId.B20_EXTENDED_SHIPPING_LINES]},
  ]) {
    it('adds the expansions\' cards to the next action deck: ' + JSON.stringify(run), () => {
      const {game, deck} = setup(run.options, run.fields);
      game.generation = run.generation;

      deck.buildResearch();

      expect(bonusIds(deck.cards).toSorted()).deep.eq(run.expected);
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

      expect({projectCards: projectCardCount(deck.cards), discarded: game.projectDeck.discardPile.length - discarded})
        .deep.eq(run.expected);
      expect(bonusIds(deck.cards)).deep.eq([BonusCardId.B21_PARTY_POLITICS]);
    });
  }

  it('plays a project card from the top of the action deck', () => {
    const {deck, played} = setup();
    deck.cards = [new Mine(), new TestBonusCard(BonusCardId.B01_METEOR_SHOWER)];

    expect(deck.playTopCard()).is.true;
    expect(played).deep.eq(['Mine']);
    expect(deck.cards).has.length(1);
  });

  it('plays a bonus card from the top of the action deck', () => {
    const {marsBot, deck} = setup();
    let resolved = 0;
    deck.cards = [new TestBonusCard(BonusCardId.B01_METEOR_SHOWER, false, () => resolved++)];

    deck.playTopCard();

    expect(resolved).eq(1);
    expect(bonusIds(marsBot.bonusDeck.discardPile)).deep.eq([BonusCardId.B01_METEOR_SHOWER]);
  });

  it('plays nothing from an empty action deck', () => {
    const {deck} = setup();

    expect(deck.playTopCard()).is.false;
  });

  for (const run of [
    {name: 'kept', card: BonusCardId.B01_METEOR_SHOWER, destroyed: false, backInDeck: false,
      expected: {discarded: [BonusCardId.B01_METEOR_SHOWER], destroyedBonusCards: 0, removed: 0}},
    {name: 'destroyed', card: BonusCardId.B01_METEOR_SHOWER, destroyed: true, backInDeck: false,
      expected: {discarded: [], destroyedBonusCards: 1, removed: 0}},
    {name: 'shuffled back', card: BonusCardId.B01_METEOR_SHOWER, destroyed: true, backInDeck: true,
      expected: {discarded: [], destroyedBonusCards: 0, removed: 0}},
    {name: 'set aside', card: BonusCardId.B16_GOVERNMENT_INTERVENTION, destroyed: false, backInDeck: false,
      expected: {discarded: [], destroyedBonusCards: 0, removed: 0}},
    {name: 'corp card kept', card: BonusCardId.B23_RAPID_SPROUTING, destroyed: false, backInDeck: false,
      expected: {discarded: [], destroyedBonusCards: 0, removed: 0}},
    {name: 'corp card destroyed', card: BonusCardId.B23_RAPID_SPROUTING, destroyed: true, backInDeck: false,
      expected: {discarded: [], destroyedBonusCards: 1, removed: 1}},
  ]) {
    it('puts a resolved bonus card where it goes next: ' + JSON.stringify(run), () => {
      const {marsBot, corpState, deck} = setup({}, {actionDeckBonusCard: BonusCardId.B23_RAPID_SPROUTING});
      const card = new TestBonusCard(run.card, run.destroyed, (bot) => {
        if (run.backInDeck) {
          bot.bonusDeck.drawPile.push(card);
        }
      });

      expect(deck.playBonusCard(card)).eq(run.destroyed);
      expect({
        discarded: bonusIds(marsBot.bonusDeck.discardPile),
        destroyedBonusCards: deck.destroyedBonusCards,
        removed: corpState.get(ACTION_DECK_BONUS_CARD_REMOVED) ?? 0,
      }).deep.eq(run.expected);
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
    marsBot.bonusDeck.drawPile.push(new TestBonusCard(BonusCardId.B02_INVASIVE_SPECIES), new TestBonusCard(BonusCardId.B01_METEOR_SHOWER));
    deck.cards = [new Mine()];

    deck.maybeMoveBonusCardToActionDeck();
    deck.maybeMoveBonusCardToActionDeck();
    deck.maybeMoveBonusCardToActionDeck();

    expect(bonusIds(deck.cards)).deep.eq([BonusCardId.B02_INVASIVE_SPECIES, BonusCardId.B01_METEOR_SHOWER]);
    expect(projectCardCount(deck.cards)).eq(1);
  });

  it('returns the setup bonus card to the bonus deck, keeping project cards and the cards that come back every generation', () => {
    const {marsBot, deck} = setup({}, {actionDeckBonusCard: BonusCardId.B23_RAPID_SPROUTING});
    deck.cards = [
      new Mine(),
      new TestBonusCard(BonusCardId.B01_METEOR_SHOWER),
      new TestBonusCard(BonusCardId.B16_GOVERNMENT_INTERVENTION),
      new TestBonusCard(BonusCardId.B23_RAPID_SPROUTING),
    ];

    deck.returnSetupBonusCardToBonusDeck();

    expect(bonusIds(deck.cards)).deep.eq([BonusCardId.B16_GOVERNMENT_INTERVENTION, BonusCardId.B23_RAPID_SPROUTING]);
    expect(projectCardCount(deck.cards)).eq(1);
    expect(bonusIds(marsBot.bonusDeck.drawPile)).deep.eq([BonusCardId.B01_METEOR_SHOWER]);
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
      const {marsBot, corpState, deck} = setup({}, {actionDeckBonusCard: BonusCardId.B01_METEOR_SHOWER});
      const card = new TestBonusCard(BonusCardId.B01_METEOR_SHOWER);
      if (run.where === 'draw') {
        marsBot.bonusDeck.drawPile.push(card);
      } else if (run.where === 'discard') {
        marsBot.bonusDeck.discardPile.push(card);
      } else if (run.where === 'action') {
        deck.cards.push(card);
      }
      corpState.set(ACTION_DECK_BONUS_CARD_REMOVED, run.removed);

      const added = deck.addBonusCard(BonusCardId.B01_METEOR_SHOWER);

      expect({added: added !== undefined, bonusDeck: marsBot.bonusDeck.drawPile.length + marsBot.bonusDeck.discardPile.length})
        .deep.eq(run.expected);
      expect(bonusIds(deck.cards)).deep.eq(run.removed === 0 ? [BonusCardId.B01_METEOR_SHOWER] : []);
      if (run.where === 'draw' || run.where === 'discard') {
        expect(added).eq(card);
      }
    });
  }

  it('removes a bonus card from the bonus deck', () => {
    const {marsBot, deck} = setup();
    marsBot.bonusDeck.drawPile.push(new TestBonusCard(BonusCardId.B02_INVASIVE_SPECIES), new TestBonusCard(BonusCardId.B01_METEOR_SHOWER));
    marsBot.bonusDeck.discardPile.push(new TestBonusCard(BonusCardId.B01_METEOR_SHOWER));

    deck.removeBonusCard(BonusCardId.B01_METEOR_SHOWER);

    expect(bonusIds(marsBot.bonusDeck.drawPile)).deep.eq([BonusCardId.B02_INVASIVE_SPECIES]);
    expect(marsBot.bonusDeck.discardPile).is.empty;
    expect(deck.cards).is.empty;
  });

  for (const run of [
    {dealt: BonusCardId.B01_METEOR_SHOWER, expected: [BonusCardId.B02_INVASIVE_SPECIES]},
    {dealt: BonusCardId.B21_PARTY_POLITICS, expected: []},
  ]) {
    it('replaces a removed setup bonus card from the bonus deck, but not a card that comes back every generation: ' + JSON.stringify(run), () => {
      const {marsBot, deck} = setup();
      marsBot.bonusDeck.drawPile.push(new TestBonusCard(BonusCardId.B02_INVASIVE_SPECIES));
      deck.cards = [new Mine(), new TestBonusCard(run.dealt)];

      deck.removeBonusCard(run.dealt);

      expect(bonusIds(deck.cards)).deep.eq(run.expected);
    });
  }

  it('shuffles project cards with a tag into the bonus deck', () => {
    const {marsBot, deck} = setup();

    deck.addProjectCardsToBonusDeck(Tag.SPACE, 2);

    const cards = marsBot.bonusDeck.drawPile;
    expect(cards).has.length(2);
    expect(cards.every((card) => card.id === undefined && cardTagsIncludingEvent(card).includes(Tag.SPACE))).is.true;
  });

  it('shuffles a bonus card into the bonus deck, or puts it at the bottom', () => {
    const {marsBot, deck} = setup();
    marsBot.bonusDeck.drawPile.push(new TestBonusCard(BonusCardId.B03_RESEARCH_AND_DEVELOPMENT));

    deck.addBonusCardToBonusDeck(BonusCardId.B01_METEOR_SHOWER);
    marsBot.bonusDeck.drawPile.push(new TestBonusCard(BonusCardId.B07_LOCAL_NEURAL_INSTANCE));
    deck.addBonusCardToBottomOfBonusDeck(BonusCardId.B02_INVASIVE_SPECIES);

    // The top of the bonus deck is the end of the draw pile
    expect(bonusIds(marsBot.bonusDeck.drawPile)).deep.eq([
      BonusCardId.B02_INVASIVE_SPECIES,
      BonusCardId.B01_METEOR_SHOWER,
      BonusCardId.B03_RESEARCH_AND_DEVELOPMENT,
      BonusCardId.B07_LOCAL_NEURAL_INSTANCE,
    ]);
  });

  it('discards the first project card with the fewest tags from the action deck', () => {
    const {game, deck} = setup();
    const [asteroid, bonusCard, mine, algae] = [new Asteroid(), new TestBonusCard(BonusCardId.B01_METEOR_SHOWER), new Mine(), new Algae()];
    deck.cards = [asteroid, bonusCard, mine, algae];

    deck.maybeDiscardProjectCardWithFewestTags();

    expect(deck.cards).deep.eq([asteroid, bonusCard, algae]);
    expect(game.projectDeck.discardPile).includes(mine);
  });

  it('discards no bonus card', () => {
    const {deck} = setup();
    deck.cards = [new TestBonusCard(BonusCardId.B01_METEOR_SHOWER)];

    deck.maybeDiscardProjectCardWithFewestTags();

    expect(deck.cards).has.length(1);
  });

  for (const run of [
    {destroyedBonusCards: 0, expected: {actionDeckCardNames: ['Mine', 'B01']}},
    {destroyedBonusCards: 2, expected: {actionDeckCardNames: ['Mine', 'B01'], destroyedBonusCards: 2}},
  ]) {
    it('saves and restores the action deck and the destroyed bonus card count: ' + JSON.stringify(run), () => {
      const {deck, marsBot} = setup();
      deck.cards = [new Mine(), new TestBonusCard(BonusCardId.B01_METEOR_SHOWER)];
      deck.destroyedBonusCards = run.destroyedBonusCards;
      const restored = new MarsBotActionDeck(marsBot, new ConstRandom(0));

      restored.restore(deck.serialize());

      expect(deck.serialize()).deep.eq(run.expected);
      expect(restored.serialize()).deep.eq(run.expected);
      expect(bonusIds(restored.cards)).deep.eq([BonusCardId.B01_METEOR_SHOWER]);
    });
  }
});
