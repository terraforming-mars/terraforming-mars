import {inplaceRemove, copyAndClear as copyAndEmpty, zip} from '../common/utils/utils';
import {CardName} from '../common/cards/CardName';
import {IGame} from './IGame';
import {IPlayer} from './IPlayer';
import {IProjectCard} from './cards/IProjectCard';
import {LunaProjectOffice} from './cards/moon/LunaProjectOffice';
import {SelectCard} from './inputs/SelectCard';
import {message} from './logs/MessageBuilder';
import {IPreludeCard} from './cards/prelude/IPreludeCard';
import {ICeoCard} from './cards/ceos/ICeoCard';

export type DraftType = 'none' | 'initial' | 'prelude' | 'ceos' | 'standard';

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
      for (const player of this.game.players) {
        arrays.push(this.draw(player));
      }
    } else {
      arrays.push(...this.game.players.map((player) => player.draftHand));
      if (this.passDirection() === 'after') {
        const array = arrays.pop();
        if (array) {
          arrays.unshift(array);
        }
      } else {
        const array = arrays.shift();
        if (array) {
          arrays.push(array);
        }
      }
    }

    for (const [player, draftHand] of zip(this.game.players, arrays)) {
      player.draftHand = draftHand;
      player.needsToDraft = true;
      this.askPlayerToDraft(player, false);
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
    const players = this.game.players;

    // When restoring drafting, it might be that nothing was dealt yet.
    if (!players.some((p) => p.needsToDraft !== undefined)) {
      this.startDraft(false);
      return;
    }

    const anybodyStillNeedsToDraft = players.some((p) => p.needsToDraft);

    for (const player of players) {
      if (player.needsToDraft) {
        this.askPlayerToDraft(player, false);
      } else if (anybodyStillNeedsToDraft) {
        this.askPlayerToDraft(player, true);
      }
    }

    if (!anybodyStillNeedsToDraft) {
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
  private askPlayerToDraft(player: IPlayer, repick: boolean): void {
    const giveTo = this.givingTo(player);
    const cardsToKeep = this.cardsToKeep(player);

    let cardsToConsider: Array<IProjectCard>;
    let enabled: Array<boolean> | undefined;
    if (repick) {
      cardsToConsider = [...player.draftHand, ...player.draftedCards.slice(-cardsToKeep)];
      // Disable the picked card only if we're keeping one card. If we keep more than
      // one card, we need to keep them all enabled since we might repick
      // one of the cards we previously picked plus a new card.
      if (cardsToKeep === 1) {
        enabled = cardsToConsider.map((_, idx) => idx < player.draftHand.length);
      }
    } else {
      cardsToConsider = player.draftHand;
    }

    const messageTitle = repick ?
      'You can change your selection until all players have selected a card. Passing to ${0}' :
      (cardsToKeep === 1 ?
        'Select a card to keep and pass the rest to ${0}' :
        'Select two cards to keep and pass the rest to ${0}');
    const selectCard = new SelectCard(
      message(messageTitle, (b) => b.player(giveTo)),
      'Select',
      cardsToConsider,
      {
        min: cardsToKeep, max: cardsToKeep, played: false,
        enabled: enabled,
      });
    selectCard.optional = repick;
    player.setWaitingFor(selectCard
      .andThen((selected) => {
        if (repick) {
          const startIndex = player.draftedCards.length - cardsToKeep;

          const movedCards = player.draftedCards.splice(startIndex, cardsToKeep);
          player.draftHand.push(...movedCards);
        }
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
    if (this.game.players.some((p) => p.needsToDraft)) {
      this.askPlayerToDraft(player, true);
      this.game.save();
      return;
    }

    // Clear all pending Repick waitingFor.
    for (const p of this.game.players) {
      if (p.getWaitingFor() !== undefined) {
        p.clearWaitingFor();
      }
    }

    // If more than 1 card is to be passed to the next player, that means we're still drafting
    if (player.draftHand.length > 1) {
      this.game.draftRound++;
      this.startDraft();
      return;
    }

    // Push last cards for each player
    for (const player of this.game.players) {
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
    if (player.tableau.has(CardName.MARS_MATHS)) {
      return 5;
    }

    return 4;
  }

  override cardsToKeep(player: IPlayer): number {
    if (this.game.draftRound === 1) {
      if (LunaProjectOffice.isActive(player)) {
        return 2;
      }
      if (player.tableau.has(CardName.MARS_MATHS)) {
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
      for (const player of this.game.players) {
        player.dealtProjectCards = player.draftedCards;
        player.draftedCards = [];
      }
      if (this.game.gameOptions.preludeExtension && this.game.gameOptions.preludeDraftVariant) {
        newPreludeDraft(this.game).startDraft();
      } else if (this.game.gameOptions.ceoExtension && this.game.gameOptions.ceosDraftVariant) {
        this.game.initialDraftIteration++;
        newCEOsDraft(this.game).startDraft();
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
    // Return a copy. Otherwise inplaceRemove on draftHand later mutates
    // dealtPreludeCards, leaking other players' picks.
    return [...player.dealtPreludeCards];
  }

  override cardsToKeep(_player: IPlayer): number {
    return 1;
  }

  override passDirection(): 'after' {
    return 'after';
  }

  override endRound() {
    this.game.initialDraftIteration++;
    for (const player of this.game.players) {
      // TODO(kberg): player.draftedCards is not ideal here.
      player.dealtPreludeCards = player.draftedCards as Array<IPreludeCard>;
      player.draftedCards = [];
    }
    if (this.game.gameOptions.ceoExtension && this.game.gameOptions.ceosDraftVariant) {
      this.game.draftRound = 1;
      newCEOsDraft(this.game).startDraft();
    } else {
      this.game.gotoInitialResearchPhase();
    }
  }
}

class CEOsDraft extends Draft {
  constructor(game: IGame) {
    super('ceos', game);
  }

  override draw(player: IPlayer) {
    // Return a copy. Otherwise inplaceRemove on draftHand later mutates
    // dealtCeoCards, leaking other players' picks.
    return [...player.dealtCeoCards];
  }

  override cardsToKeep(_player: IPlayer): number {
    return 1;
  }

  override passDirection(): 'after' {
    return 'after';
  }

  override endRound() {
    for (const player of this.game.players) {
      // TODO(kberg): player.draftedCards is not ideal here.
      player.dealtCeoCards = player.draftedCards as Array<ICeoCard>;
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

export function newCEOsDraft(game: IGame) {
  return new CEOsDraft(game);
}
