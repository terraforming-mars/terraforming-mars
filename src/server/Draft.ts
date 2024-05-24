import {inplaceRemove, copyAndClear as copyAndEmpty, zip} from '../common/utils/utils';
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

  protected abstract cardsToDraw(player: IPlayer): number;
  protected abstract cardsToKeep(player: IPlayer): number;
  protected abstract draw(player: IPlayer): Array<IProjectCard>;
  protected abstract draftDirection(): 'before' | 'after';
  protected abstract endRound(): void;

  public startDraft() {
    this.game.save();

    const arrays: Array<Array<IProjectCard>> = [];
    if (this.game.draftRound === 1) {
      for (const player of this.game.getPlayers()) {
        arrays.push(this.draw(player));
      }
    } else {
      arrays.push(...this.game.getPlayers().map((player) => player.draftHand));
      if (this.draftDirection() === 'after') {
        arrays.unshift(arrays.pop()!); // eslint-disable-line @typescript-eslint/no-non-null-assertion
      } else {
        arrays.push(arrays.shift()!); // eslint-disable-line @typescript-eslint/no-non-null-assertion
      }
    }

    for (const [player, draftHand] of zip(this.game.getPlayers(), arrays)) {
      player.draftHand = draftHand;
      player.needsToDraft = true;
      this.askPlayerToDraft(player);
    }
  }

  public restoreDraft() {
    for (const player of this.game.getPlayers()) {
      if (player.needsToDraft) {
        this.askPlayerToDraft(player);
      }
    }
  }

  private draftingFrom(player: IPlayer): IPlayer {
    return this.draftDirection() === 'before' ? this.game.getPlayerBefore(player) : this.game.getPlayerAfter(player);
  }

  private draftingTo(player: IPlayer): IPlayer {
    return this.draftDirection() === 'after' ? this.game.getPlayerBefore(player) : this.game.getPlayerAfter(player);
  }

  /**
   * Ask the player to choose from a set of cards.
   */
  private askPlayerToDraft(player: IPlayer): void {
    const passTo = this.draftingTo(player);
    const cardsToKeep = this.cardsToKeep(player);

    const messageTitle = cardsToKeep === 1 ?
      'Select a card to keep and pass the rest to ${0}' :
      'Select two cards to keep and pass the rest to ${0}';
    player.setWaitingFor(
      new SelectCard(
        message(messageTitle, (b) => b.player(passTo)),
        'Keep',
        player.draftHand,
        {min: cardsToKeep, max: cardsToKeep, played: false})
        .andThen((selected) => {
          for (const card of selected) {
            player.draftedCards.push(card);
            inplaceRemove(player.draftHand, card);
          }
          this.onCardChosen(player);
          return undefined;
        }),
    );
  }

  private onCardChosen(player: IPlayer): void {
    player.needsToDraft = false;

    // If anybody still needs to draft, stop here.
    if (this.game.getPlayers().some((p) => p.needsToDraft === true)) {
      // if (this.game.gameOptions.incrementalDraft) {
      this.game.save();
      // }
      return;
    }

    // If more than 1 card are to be passed to the next player, that means we're still drafting
    if (player.draftHand.length > 1) {
      this.game.draftRound++;
      this.startDraft();
      return;
    }

    // Push last cards for each player
    for (const player of this.game.getPlayers()) {
      player.draftedCards.push(...copyAndEmpty(this.draftingFrom(player).draftHand));
      player.needsToDraft = undefined;
    }

    this.endRound();
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
      this.startDraft();
      break;
    case 3:
      for (const player of this.game.getPlayers()) {
        player.dealtProjectCards = player.draftedCards;
        player.draftedCards = [];
      }
      if (this.game.gameOptions.preludeExtension && this.game.gameOptions.preludeDraftVariant) {
        newPreludeDraft(this.game).startDraft();
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
