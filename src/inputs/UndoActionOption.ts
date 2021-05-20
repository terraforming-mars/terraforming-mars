import {SelectOption} from './SelectOption';

export class UndoActionOption extends SelectOption {
  constructor() {
    super('Undo last action', 'Undo', () => undefined);
  }
}
