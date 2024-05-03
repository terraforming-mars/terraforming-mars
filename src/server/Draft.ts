import {CardName} from '../common/cards/CardName';
import {IGame} from './IGame';
import {IPlayer} from './IPlayer';
import {LunaProjectOffice} from './cards/moon/LunaProjectOffice';

export type DraftType = 'none' | 'initial' | 'prelude' | 'standard';

export abstract class Draft {
  constructor(public readonly type: DraftType, protected readonly game: IGame) {}

  abstract cardsToDraw(player: IPlayer): number;
  abstract cardsToKeep(player: IPlayer): number;
}

/**
 * Special case where a player isn't drafting cards.
 */
class NonDraft extends Draft {
  constructor(game: IGame) {
    super('standard', game);
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
}

class StandardDraft extends Draft {
  constructor(game: IGame) {
    super('standard', game);
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
}

class InitialDraft extends Draft {
  constructor(game: IGame) {
    super('initial', game);
  }

  override cardsToDraw(_player: IPlayer): number {
    return 5;
  }

  override cardsToKeep(_player: IPlayer): number {
    return 1;
  }
}

class PreludeDraft extends Draft {
  constructor(game: IGame) {
    super('prelude', game);
  }

  override cardsToDraw(_player: IPlayer): number {
    return 4;
  }

  override cardsToKeep(_player: IPlayer): number {
    return 1;
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
