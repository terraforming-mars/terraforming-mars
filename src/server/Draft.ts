import {IGame} from './IGame';

export type DraftType = 'initial' | 'prelude' | 'standard';

export abstract class Draft {
  constructor(public readonly type: DraftType, protected readonly game: IGame) {}
}

class StandardDraft extends Draft {
  constructor(game: IGame) {
    super('standard', game);
  }
}

class InitialDraft extends Draft {
  constructor(game: IGame) {
    super('initial', game);
  }
}

class PreludeDraft extends Draft {
  constructor(game: IGame) {
    super('prelude', game);
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
