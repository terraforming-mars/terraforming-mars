import {inplaceRemove} from '../common/utils/utils';
import {CardName} from '../common/cards/CardName';
import {IGame} from './IGame';
import {IPlayer} from './IPlayer';
import {IProjectCard} from './cards/IProjectCard';
import {LunaProjectOffice} from './cards/moon/LunaProjectOffice';
import {SelectCard} from './inputs/SelectCard';
import {message} from './logs/MessageBuilder';

export type DraftType = 'none' | 'initial' | 'prelude' | 'standard';

/*
 * Drafting terminology:
 *
 * Draft iteration: A complete cycle of draft rounds. In the standard draft, there are 4 draft rounds in a draft iteration.
 *  In the initial draft, there are 2 iterations, or up to 3 with preludes.
 * Draft round: A single pass through the players, where each player gets to pick a card.
*/

/**
 * Implements a specific draft.
 */
export abstract class Draft {
  constructor(public readonly type: DraftType, protected readonly game: IGame) {}

  abstract cardsToDraw(player: IPlayer): number;
  abstract cardsToKeep(player: IPlayer): number;
  abstract draw(player: IPlayer): Array<IProjectCard>;
  abstract draftDirection(): 'before' | 'after';
  abstract endRound(): void;

  startRound() {
    this.game.draftedPlayers.clear();
    for (const player of this.game.getPlayers()) {
      player.needsToDraft = true;
      const draftCardsFrom = this.draftingFrom(player).id;
      const cards = this.game.draftRound === 1 ? this.draw(player) : (this.game.unDraftedCards.get(draftCardsFrom) ?? []);
      this.game.unDraftedCards.delete(draftCardsFrom);
      this.askPlayerToDraft(player, cards);
    }
  }

  draftingFrom(player: IPlayer): IPlayer {
    return this.draftDirection() === 'before' ? this.game.getPlayerBefore(player) : this.game.getPlayerAfter(player);
  }

  draftingTo(player: IPlayer): IPlayer {
    return this.draftDirection() === 'after' ? this.game.getPlayerBefore(player) : this.game.getPlayerAfter(player);
  }

  /**
   * Ask the player to draft from a set of cards.
   *
   * @param passedCards The cards received from the draw, or from the prior player.
   */
  public askPlayerToDraft(player: IPlayer, passedCards: Array<IProjectCard>): void {
    const passTo = this.draftingTo(player);
    const cardsToKeep = this.cardsToKeep(player);

    const cards = [...passedCards];

    const messageTitle = cardsToKeep === 1 ?
      'Select a card to keep and pass the rest to ${0}' :
      'Select two cards to keep and pass the rest to ${0}';
    player.setWaitingFor(
      new SelectCard(
        message(messageTitle, (b) => b.player(passTo)),
        'Keep',
        cards,
        {min: cardsToKeep, max: cardsToKeep, played: false})
        .andThen((selected) => {
          for (const card of selected) {
            player.draftedCards.push(card);
            inplaceRemove(cards, card);
          }
          this.playerIsFinishedWithDraftingRound(player, cards);
          return undefined;
        }),
    );
  }

  /**
   * Called after a player drafts.
   *
   * @param player The player who drafted
   * @param cards The cards the player didn't draft, which they will pass to the next player.
   */
  public playerIsFinishedWithDraftingRound(player: IPlayer, cards : Array<IProjectCard>): void {
    this.game.draftedPlayers.add(player.id);
    this.game.unDraftedCards.set(player.id, cards);

    player.needsToDraft = false;
    if (this.allPlayersHaveFinishedDraft() === false) {
      return;
    }

    // If more than 1 card are to be passed to the next player, that means we're still drafting
    if (cards.length > 1) {
      this.game.draftRound++;
      this.game.runDraftRound(this);
      return;
    }

    // Push last card for each player
    for (const player of this.game.getPlayers()) {
      const lastCards = this.game.unDraftedCards.get(this.draftingFrom(player).id);
      if (lastCards !== undefined) {
        player.draftedCards.push(...lastCards);
      }
      player.needsToDraft = undefined;
    }

    this.endRound();
  }

  private hasDrafted(player: IPlayer): boolean {
    return this.game.draftedPlayers.has(player.id);
  }


  private allPlayersHaveFinishedDraft(): boolean {
    for (const player of this.game.getPlayers()) {
      if (!this.hasDrafted(player)) {
        return false;
      }
    }
    return true;
  }
}

/**
 * Special case where a player isn't drafting cards.
 *
 * This commingles the concepts of the draft phase and research phase. But for now this is OK. Code is simpler.
 */
class NonDraft extends Draft {
  constructor(game: IGame) {
    super('standard', game);
  }

  override draw(player: IPlayer) {
    const cardsToDraw = this.cardsToDraw(player);
    return this.game.projectDeck.drawN(this.game, cardsToDraw, 'bottom');
  }

  override cardsToDraw(player: IPlayer): number {
    if (LunaProjectOffice.isActive(player)) {
      return 5;
    }
    if (player.isCorporation(CardName.MARS_MATHS)) {
      return 5;
    }

    return 4;
  }

  override cardsToKeep(player: IPlayer): number {
    if (LunaProjectOffice.isActive(player)) {
      return 5;
    }

    return 4;
  }

  override draftDirection(): never {
    throw new Error('Method not implemented.');
  }

  override endRound(): never {
    throw new Error('Not implemented');
  }
}

class StandardDraft extends Draft {
  constructor(game: IGame) {
    super('standard', game);
  }

  override draw(player: IPlayer) {
    const cardsToDraw = this.cardsToDraw(player);
    return this.game.projectDeck.drawN(this.game, cardsToDraw, 'bottom');
  }

  override cardsToDraw(player: IPlayer): number {
    if (LunaProjectOffice.isActive(player)) {
      return 5;
    }
    if (player.isCorporation(CardName.MARS_MATHS)) {
      return 5;
    }

    return 4;
  }

  override cardsToKeep(player: IPlayer): number {
    if (LunaProjectOffice.isActive(player)) {
      return 2;
    }
    if (player.isCorporation(CardName.MARS_MATHS)) {
      return 2;
    }

    return 1;
  }

  override draftDirection() {
    return this.game.generation % 2 === 0 ? 'before' : 'after';
  }

  override endRound() {
    this.game.gotoResearchPhase();
  }
}

class InitialDraft extends Draft {
  constructor(game: IGame) {
    super('initial', game);
  }

  override draw(player: IPlayer) {
    const cardsToDraw = this.cardsToDraw(player);
    return this.game.projectDeck.drawN(this.game, cardsToDraw, 'bottom');
  }

  override cardsToDraw(_player: IPlayer): number {
    return 5;
  }

  override cardsToKeep(_player: IPlayer): number {
    return 1;
  }

  override draftDirection() {
    return this.game.initialDraftIteration === 2 ? 'before' : 'after';
  }

  override endRound() {
    this.game.initialDraftIteration++;
    // TODO(kberg): Move this to runDraftRound.
    this.game.draftRound = 1;

    switch (this.game.initialDraftIteration) {
    case 2:
      this.game.runDraftRound(this);
      break;
    case 3:
      for (const player of this.game.getPlayers()) {
        player.dealtProjectCards = player.draftedCards;
        player.draftedCards = [];
      }
      if (this.game.gameOptions.preludeExtension && this.game.gameOptions.preludeDraftVariant) {
        this.game.runDraftRound(newPreludeDraft(this.game));
      } else {
        this.game.gotoInitialResearchPhase();
      }
      break;
    }
  }
}

class PreludeDraft extends Draft {
  constructor(game: IGame) {
    super('prelude', game);
  }

  override draw(player: IPlayer) {
    return player.dealtPreludeCards;
  }

  override cardsToDraw(_player: IPlayer): number {
    return 4;
  }

  override cardsToKeep(_player: IPlayer): number {
    return 1;
  }

  override draftDirection(): 'after' {
    return 'after';
  }

  override endRound() {
    for (const player of this.game.getPlayers()) {
      player.dealtPreludeCards = player.draftedCards;
      player.draftedCards = [];
    }

    this.game.gotoInitialResearchPhase();
  }
}

export function newNonDraft(game: IGame) {
  return new NonDraft(game);
}

export function newStandardDraft(game: IGame) {
  return new StandardDraft(game);
}

export function newInitialDraft(game: IGame) {
  return new InitialDraft(game);
}

export function newPreludeDraft(game: IGame) {
  return new PreludeDraft(game);
}
