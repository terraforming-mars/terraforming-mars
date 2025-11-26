import {SelectOption} from '@/server/inputs/SelectOption';

export class UndoActionOption extends SelectOption {
  constructor() {
    // No AndThen
    super('Undo last action', 'Undo');
    this.warnings = ['undoBestEffort'];
  }
}
