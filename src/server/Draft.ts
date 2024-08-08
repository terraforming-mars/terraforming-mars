import {inplaceRemove, copyAndClear as copyAndEmpty, zip} from '../common/utils/utils';
import {CardName} from '../common/cards/CardName';
import {IGame} from './IGame';
import {IPlayer} from './IPlayer';
import {IProjectCard} from './cards/IProjectCard';
import {LunaProjectOffice} from './cards/moon/LunaProjectOffice';
import {SelectCard} from './inputs/SelectCard';
import {message} from './logs/MessageBuilder';
import {IPreludeCard} from './cards/prelude/IPreludeCard';

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

  /** draw cards into hand at the start of the iteration. */
  protected abstract draw(player: IPlayer): Array<IProjectCard>;
  /** The number of cards the player will choose in this draft round. Almost always 1. */
  protected abstract cardsToKeep(player: IPlayer): number;
  /** The direction in which cards are passed. Either to the player before (right) or after (left). */
  protected abstract passDirection(): 'before' | 'after';
  /** Called when all cards are drafted. */
  protected abstract endRound(): void;

  /**
   * Start an entire draft iteration (or draft round). Saves the game, sets all the cards up, and asks players to make their first choice.
   *
   * When save is true or unspecified, the game is saved after set-up. It is not appropriate to save when restoring a game.
   */
  // TODO(kberg): Create a startDraft() which draws, and a continueDraft() which uses the cards a player is handed.
  public startDraft(save: boolean = true) {
    const arrays: Array<Array<IProjectCard>> = [];
    if (this.game.draftRound === 1) {
      for (const player of this.game.getPlayers()) {
        arrays.push(this.draw(player));
      }
    } else {
      arrays.push(...this.game.getPlayers().map((player) => player.draftHand));
      if (this.passDirection() === 'after') {
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
    if (save) {
      this.game.save();
    }
  }

  /**
   * Called when the game is reloaded from disk. Restores the draft state.
   *
   * Games are stored after every selection, whereas historically it was
   * stored after round. So restoring the draft is a bit tricky.
   */
  public restoreDraft() {
    const players = this.game.getPlayers();

    // When restoring drafting, it might be that nothing was dealt yet.
    if (!players.some((p) => p.needsToDraft !== undefined)) {
      this.startDraft(false);
      return;
    }

    for (const player of players) {
      if (player.needsToDraft) {
        this.askPlayerToDraft(player);
      }
    }

    if (!players.some((p) => p.needsToDraft)) {
      this.endRound();
    }
  }

  /** The player this player is taking their cards from when everybody passes their draft hands */
  private takingFrom(player: IPlayer): IPlayer {
    return this.passDirection() === 'after' ? this.game.getPlayerBefore(player) : this.game.getPlayerAfter(player);
  }

  /** The player this player is givign their cards to when everybody passes their draft hands */
  private givingTo(player: IPlayer): IPlayer {
    return this.passDirection() === 'after' ? this.game.getPlayerAfter(player) : this.game.getPlayerBefore(player);
  }

  /**
   * Ask the player to choose from a set of cards.
   */
  private askPlayerToDraft(player: IPlayer): void {
    const giveTo = this.givingTo(player);
    const cardsToKeep = this.cardsToKeep(player);

    const messageTitle = cardsToKeep === 1 ?
      'Select a card to keep and pass the rest to ${0}' :
      'Select two cards to keep and pass the rest to ${0}';
    player.setWaitingFor(
      new SelectCard(
        message(messageTitle, (b) => b.player(giveTo)),
        'Keep',
        player.draftHand,
        {min: cardsToKeep, max: cardsToKeep, played: false})
        .andThen((selected) => {
          for (const card of selected) {
            player.draftedCards.push(card);
            inplaceRemove(player.draftHand, card);
          }
          this.onCardDrafted(player);
          return undefined;
        }),
    );
  }

  /** Called when a player has chosen a card to draft. */
  private onCardDrafted(player: IPlayer): void {
    player.needsToDraft = false;

    // If anybody still needs to draft, stop here.
    if (this.game.getPlayers().some((p) => p.needsToDraft)) {
      this.game.save();
      return;
    }

    // If more than 1 card is to be passed to the next player, that means we're still drafting
    if (player.draftHand.length > 1) {
      this.game.draftRound++;
      this.startDraft();
      return;
    }

    // Push last cards for each player
    for (const player of this.game.getPlayers()) {
      player.draftedCards.push(...copyAndEmpty(this.takingFrom(player).draftHand));
      player.needsToDraft = undefined;
    }

    this.endRound();
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

  private cardsToDraw(player: IPlayer): number {
    if (LunaProjectOffice.isActive(player)) {
      return 5;
    }
    if (player.isCorporation(CardName.MARS_MATHS)) {
      return 5;
    }

    return 4;
  }

  override cardsToKeep(player: IPlayer): number {
    if (this.game.draftRound === 1) {
      if (LunaProjectOffice.isActive(player)) {
        return 2;
      }
      if (player.isCorporation(CardName.MARS_MATHS)) {
        return 2;
      }
    }

    return 1;
  }

  /** Return whether passing this round goes to the player after (right, +1) or before (left, -1) */
  override passDirection() {
    return this.game.generation % 2 === 0 ? 'after' : 'before';
  }

  override endRound() {
    this.game.gotoResearchPhase();
  }
}

class InitialDraft extends Draft {
  constructor(game: IGame) {
    super('initial', game);
  }

  override draw(_player: IPlayer) {
    return this.game.projectDeck.drawN(this.game, 5, 'bottom');
  }

  override cardsToKeep(_player: IPlayer): number {
    return 1;
  }

  override passDirection() {
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

  override cardsToKeep(_player: IPlayer): number {
    return 1;
  }

  override passDirection(): 'after' {
    return 'after';
  }

  override endRound() {
    for (const player of this.game.getPlayers()) {
      // TODO(kberg): player.draftedCards is not ideal here.
      player.dealtPreludeCards = player.draftedCards as Array<IPreludeCard>;
      player.draftedCards = [];
    }

    this.game.gotoInitialResearchPhase();
  }
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
