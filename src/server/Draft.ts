export type DraftType = 'initial' | 'prelude' | 'standard';

export abstract class Draft {
  constructor(public readonly type: DraftType) {}
}

class StandardDraft extends Draft {
  constructor() {
    super('standard');
  }
}

class InitialDraft extends Draft {
  constructor() {
    super('initial');
  }
}

class PreludeDraft extends Draft {
  constructor() {
    super('prelude');
  }
}

export function newStandardDraft() {
  return new StandardDraft();
}

export function newInitialDraft() {
  return new InitialDraft();
}

export function newPreludeDraft() {
  return new PreludeDraft();
}
