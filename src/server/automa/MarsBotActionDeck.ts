import {BonusCardId} from '../../common/automa/AutomaTypes';
import {CardName} from '../../common/cards/CardName';
import {Tag} from '../../common/cards/Tag';
import {Random} from '../../common/utils/Random';
import {inplaceRemove} from '../../common/utils/utils';
import {IProjectCard} from '../cards/IProjectCard';
import {newCard} from '../createCard';
import {inplaceShuffle} from '../utils/shuffle';
import {IMarsBot} from './IMarsBot';
import {MarsBotBonusCard} from './MarsBotBonusCard';
import {MarsBotBonusDeckCard, bonusCardDisplayName, createBonusCard} from './bonusCards/MarsBotBonusCards';
import {cardTagsIncludingEvent} from './MarsBotTags';
import {ACTION_DECK_BONUS_CARD_REMOVED} from './corps/corpHelpers';

/** Expansion bonus cards set aside at setup: each generation they go back into the action deck. */
const SET_ASIDE_BONUS_CARDS: ReadonlySet<BonusCardId> = new Set([
  BonusCardId.B16_GOVERNMENT_INTERVENTION,
  BonusCardId.B19_SHIPPING_LINES,
  BonusCardId.B20_EXTENDED_SHIPPING_LINES,
  BonusCardId.B21_PARTY_POLITICS,
]);

/** The action deck as a save holds it: bonus cards by id, project cards by name. */
export type SerializedActionDeck = {
  actionDeckCardNames: Array<string>;
  destroyedBonusCards?: number;
};

function isProjectCard(card: IProjectCard | MarsBotBonusCard): card is IProjectCard {
  return 'cost' in card && 'tags' in card;
}

/**
 * MarsBot's action deck: the cards it plays one per turn this generation, and the bonus cards it
 * draws from its bonus deck.
 */
export class MarsBotActionDeck {
  /** The cards left to play this generation, the next one first. */
  public cards: Array<IProjectCard | MarsBotBonusCard> = [];

  /** Bonus cards destroyed while the bot resolved them (the Land Specialist milestone). */
  public destroyedBonusCards: number = 0;

  constructor(
    private readonly marsBot: IMarsBot,
    private readonly random: Random,
  ) {}

  /** Builds the first action deck: 3 project cards and 1 bonus card, plus 3 project cards with Prelude. */
  public buildInitial(): void {
    const game = this.marsBot.game;
    // Prelude: MarsBot gets 3 extra project cards instead of Prelude cards
    const numProjectCards = 3 + (game.gameOptions.preludeExtension ? 3 : 0);
    const projectCards = game.projectDeck.drawN(game, numProjectCards);
    const bonusCard = this.marsBot.bonusDeck.draw(game);
    const deck: Array<IProjectCard | MarsBotBonusCard> = [...projectCards];
    if (bonusCard) {
      deck.push(bonusCard);
    }
    this.addGovernmentIntervention(deck);
    // T-3: Shuffle Party Politics into the initial action deck when Turmoil is enabled
    this.addPartyPolitics(deck);
    inplaceShuffle(deck, this.random);
    this.cards = deck;
  }

  /** Add Government Intervention (B16) to action deck if Venus is enabled. */
  private addGovernmentIntervention(deck: Array<IProjectCard | MarsBotBonusCard>): void {
    if (this.marsBot.game.gameOptions.venusNextExtension) {
      deck.push(createBonusCard(BonusCardId.B16_GOVERNMENT_INTERVENTION));
    }
  }

  /** T-3/T-6: Add Party Politics (B21) to the deck with Turmoil, unless the corp puts its own card in its place. */
  private addPartyPolitics(deck: Array<IProjectCard | MarsBotBonusCard>): void {
    if (!this.marsBot.game.gameOptions.turmoilExtension) {
      return;
    }
    if (this.marsBot.replacesPartyPolitics) {
      return;
    }
    deck.push(createBonusCard(BonusCardId.B21_PARTY_POLITICS));
  }

  /**
   * C-10: After gen 1, shuffle Shipping Lines (B19) into the action deck.
   * C-11: If 2nd Trade Fleet is unlocked, also shuffle Extended Shipping Lines (B20).
   */
  private addShippingLines(deck: Array<IProjectCard | MarsBotBonusCard>): void {
    if (!this.marsBot.game.gameOptions.coloniesExtension) {
      return;
    }
    if (this.marsBot.game.generation <= 1) {
      return;
    }
    deck.push(createBonusCard(BonusCardId.B19_SHIPPING_LINES));
    if (this.marsBot.hasSecondTradeFleet) {
      deck.push(createBonusCard(BonusCardId.B20_EXTENDED_SHIPPING_LINES));
    }
  }

  /** Builds the action deck for a new generation, without the draft. */
  public buildResearch(): void {
    const game = this.marsBot.game;
    const projectCards = game.projectDeck.drawN(game, 3);
    const bonusCard = this.marsBot.bonusDeck.draw(game);

    const deck: Array<IProjectCard | MarsBotBonusCard> = [...projectCards];
    if (bonusCard !== undefined) {
      deck.push(bonusCard);
    }
    this.addGovernmentIntervention(deck);
    // T-6: Reshuffle Party Politics into action deck each generation
    this.addPartyPolitics(deck);
    // C-10/C-11: Inject Shipping Lines (and Extended if 2nd Trade Fleet unlocked)
    this.addShippingLines(deck);

    inplaceShuffle(deck, this.random);
    this.cards = deck;

    game.log('MarsBot builds action deck with ${0} cards', (b) => b.number(this.cards.length));
  }

  /** Builds the action deck for a new generation from the cards MarsBot drafted. */
  public buildResearchFromDraft(draftedCards: Array<IProjectCard>, skipDiscard: boolean = false): void {
    const game = this.marsBot.game;
    inplaceShuffle(draftedCards, this.random);
    if (!skipDiscard) {
      // Normally discard 1 drafted card to project discard
      const discarded = draftedCards.pop();
      if (discarded) {
        game.projectDeck.discardPile.push(discarded);
        game.log('MarsBot discards ${0} after the draft', (b) => b.card(discarded));
      }
    }

    // Add 1 bonus card
    const bonusCard = this.marsBot.bonusDeck.draw(game);
    const deck: Array<IProjectCard | MarsBotBonusCard> = [...draftedCards];
    if (bonusCard !== undefined) {
      deck.push(bonusCard);
    }
    this.addGovernmentIntervention(deck);
    // T-6: Reshuffle Party Politics into action deck each generation
    this.addPartyPolitics(deck);
    // C-10/C-11: Inject Shipping Lines (and Extended if 2nd Trade Fleet unlocked)
    this.addShippingLines(deck);

    inplaceShuffle(deck, this.random);
    this.cards = deck;
    game.log('MarsBot builds action deck from draft with ${0} cards', (b) => b.number(this.cards.length));
  }

  /** Plays the top card of the action deck. Does nothing when the deck is empty. */
  public playTopCard(): void {
    const card = this.cards.shift();
    if (card === undefined) {
      return;
    }
    if (isProjectCard(card)) {
      this.marsBot.resolveProjectCard(card);
    } else {
      this.marsBot.game.log('MarsBot plays bonus card: ${0}', (b) => b.rawString(bonusCardDisplayName(card)));
      this.playBonusCard(card);
    }
  }

  /**
   * Resolves a card drawn from the action deck or the bonus deck, and puts it where it goes next.
   *
   * Returns true when the card was destroyed or went back into the bonus deck, so it isn't discarded.
   */
  public playBonusCard(card: MarsBotBonusDeckCard): boolean {
    const marsBot = this.marsBot;
    if (card.id === undefined) {
      // A project card from the bonus deck is played, so it leaves the bonus deck
      marsBot.resolveProjectCard(card);
      return false;
    }
    const destroyed = card.resolve(marsBot);
    // Only a destroyed card counts for the Land Specialist milestone, not one shuffled back into the deck.
    // Bonus cards a corp's setup resolves and removes don't come through here, so they don't count.
    if (destroyed && !marsBot.bonusDeck.drawPile.includes(card)) {
      this.destroyedBonusCards++;
    }
    // The corp's own action deck card stays out of the game once it destroys itself
    if (destroyed && card.id === marsBot.actionDeckBonusCard) {
      marsBot.setCorpState(ACTION_DECK_BONUS_CARD_REMOVED, 1);
    }
    // A card that returns to the action deck every generation waits outside the bonus deck
    if (!destroyed && !this.returnsToActionDeck(card)) {
      marsBot.bonusDeck.discard(card);
    }
    return destroyed;
  }

  /** Draws the top bonus card and shuffles it into the action deck. Does nothing when both bonus piles are empty. */
  public maybeMoveBonusCardToActionDeck(): void {
    const bonusCard = this.marsBot.bonusDeck.draw(this.marsBot.game);
    if (bonusCard === undefined) {
      return;
    }
    this.shuffleIntoActionDeck(bonusCard);
  }

  /** Takes the setup bonus card out of the action deck and shuffles it back into the bonus deck. */
  public returnSetupBonusCardToBonusDeck(): void {
    const kept: Array<IProjectCard | MarsBotBonusCard> = [];
    for (const card of this.cards) {
      if (isProjectCard(card) || this.returnsToActionDeck(card)) {
        kept.push(card);
      } else {
        this.shuffleIntoBonusDeck(card);
        this.marsBot.game.log('MarsBot returns ${0} to its bonus deck', (b) => b.rawString(bonusCardDisplayName(card)));
      }
    }
    this.cards = kept;
  }

  /** Draws project cards and shuffles them into the action deck. */
  public drawProjectCards(count: number): void {
    const game = this.marsBot.game;
    const cards = game.projectDeck.drawN(game, count);
    for (const card of cards) {
      this.shuffleIntoActionDeck(card);
    }
  }

  /**
   * Shuffles a bonus card into the action deck, pulling it from the bonus deck when present.
   *
   * Returns the card, or undefined when the action deck already holds it, or when it is the corp's
   * own action deck card and has destroyed itself.
   */
  public addBonusCard(bonusCardId: BonusCardId): MarsBotBonusCard | undefined {
    if (this.cards.some((c) => !isProjectCard(c) && c.id === bonusCardId)) {
      return undefined;
    }
    if (bonusCardId === this.marsBot.actionDeckBonusCard && this.marsBot.getCorpState(ACTION_DECK_BONUS_CARD_REMOVED) > 0) {
      return undefined;
    }
    // Take the card out of the bonus deck when it is there, otherwise create it
    const card = this.marsBot.bonusDeck.findAndRemove(bonusCardId) ?? createBonusCard(bonusCardId);
    this.shuffleIntoActionDeck(card);
    return card;
  }

  /** Puts a card into the action deck at a random position. */
  private shuffleIntoActionDeck(card: IProjectCard | MarsBotBonusCard): void {
    this.cards.splice(this.random.nextInt(this.cards.length + 1), 0, card);
  }

  /** Whether a bonus card goes back into the action deck every generation, so it never belongs in the bonus deck. */
  public returnsToActionDeck(card: MarsBotBonusDeckCard): boolean {
    if (card.id === undefined) {
      return false;
    }
    return SET_ASIDE_BONUS_CARDS.has(card.id) || card.id === this.marsBot.actionDeckBonusCard;
  }

  /**
   * Removes a bonus card from the bonus deck and from the action deck, for a corp's setup.
   *
   * The setup bonus card is dealt before the corporation is chosen (rulebook A setup step 3). When
   * the corp destroys that card, the bonus deck deals a replacement, so the first action deck keeps
   * its bonus card. A set-aside expansion card (Party Politics) gets none.
   */
  public removeBonusCard(bonusCardId: BonusCardId): void {
    this.marsBot.bonusDeck.removeById(bonusCardId);
    const dealt = this.cards.find((c): c is MarsBotBonusCard => !isProjectCard(c) && c.id === bonusCardId);
    if (dealt === undefined) {
      return;
    }
    inplaceRemove(this.cards, dealt);
    if (!this.returnsToActionDeck(dealt)) {
      this.maybeMoveBonusCardToActionDeck();
      this.marsBot.game.log('MarsBot replaces the destroyed setup bonus card with one from its bonus deck');
    }
  }

  /**
   * Reveals project cards until `count` of them carry `tag`, and shuffles those into the bonus deck.
   *
   * The other revealed cards are discarded.
   */
  public addProjectCardsToBonusDeck(tag: Tag, count: number): void {
    const game = this.marsBot.game;
    const cards = game.projectDeck.drawByConditionOrThrow(game, count, (card) => cardTagsIncludingEvent(card).includes(tag));
    for (const card of cards) {
      this.shuffleIntoBonusDeck(card);
      game.log('MarsBot adds ${0} to its bonus deck', (b) => b.card(card));
    }
  }

  /** Shuffles a bonus card into the bonus deck's draw pile. */
  public addBonusCardToBonusDeck(bonusCardId: BonusCardId): void {
    this.shuffleIntoBonusDeck(createBonusCard(bonusCardId));
  }

  /** Puts a card into the bonus deck's draw pile at a random position. */
  private shuffleIntoBonusDeck(card: MarsBotBonusDeckCard): void {
    const drawPile = this.marsBot.bonusDeck.drawPile;
    drawPile.splice(this.random.nextInt(drawPile.length + 1), 0, card);
  }

  /** Puts a bonus card at the bottom of the bonus deck's draw pile. */
  public addBonusCardToBottomOfBonusDeck(bonusCardId: BonusCardId): void {
    // The deck draws from the end of the draw pile
    this.marsBot.bonusDeck.drawPile.unshift(createBonusCard(bonusCardId));
  }

  /**
   * Discards the project card with the fewest tags from the action deck, the first one on a tie.
   *
   * Bonus cards are never chosen: with no project card in the action deck nothing is discarded.
   */
  public maybeDiscardProjectCardWithFewestTags(): void {
    let fewest: IProjectCard | undefined;
    for (const card of this.cards) {
      if (isProjectCard(card) && (fewest === undefined || cardTagsIncludingEvent(card).length < cardTagsIncludingEvent(fewest).length)) {
        fewest = card;
      }
    }
    if (fewest === undefined) {
      return;
    }
    const discarded = fewest;
    inplaceRemove(this.cards, discarded);
    this.marsBot.game.projectDeck.discardPile.push(discarded);
    this.marsBot.game.log('MarsBot (Polyphemos): discarded ${0}, the project card with the fewest tags, from its action deck', (b) => b.card(discarded));
  }

  public serialize(): SerializedActionDeck {
    const state: SerializedActionDeck = {
      actionDeckCardNames: this.cards.map((c) => isProjectCard(c) ? c.name : c.id),
    };
    if (this.destroyedBonusCards > 0) {
      state.destroyedBonusCards = this.destroyedBonusCards;
    }
    return state;
  }

  /** Restores the action deck. Keys a save lacks leave their part as it is. */
  public restore(state: Partial<SerializedActionDeck>): void {
    if (state.destroyedBonusCards !== undefined) {
      this.destroyedBonusCards = state.destroyedBonusCards;
    }
    if (state.actionDeckCardNames !== undefined) {
      this.cards = [];
      for (const name of state.actionDeckCardNames) {
        if (Object.values(BonusCardId).includes(name as BonusCardId)) {
          this.cards.push(createBonusCard(name as BonusCardId));
        } else {
          const card = newCard(name as CardName);
          if (card !== undefined) {
            this.cards.push(card as IProjectCard);
          }
        }
      }
    }
  }
}
