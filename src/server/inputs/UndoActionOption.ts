import {SelectOption} from './SelectOption';

export class UndoActionOption extends SelectOption {
  constructor() {
    // No AndThen
    super('Undo last action', 'Undo');
  }
}
