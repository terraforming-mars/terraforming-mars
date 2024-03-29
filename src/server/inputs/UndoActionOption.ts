import { SelectOption } from "./basicInputs/SelectOption";


export class UndoActionOption extends SelectOption {
  constructor() {
    // No AndThen
    super('Undo last action', 'Undo');
  }
}
