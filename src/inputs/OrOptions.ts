
import {PlayerInput} from '../PlayerInput';
import {PlayerInputTypes} from '../PlayerInputTypes';
import {PlayerInputs} from './PlayerInputs';

export class OrOptions implements PlayerInput {
  public cb(): PlayerInput | undefined {
    return undefined;
  }
    public title = 'Select one option';
    public buttonLabel: string = 'Save';
    public options: Array<PlayerInput>;
    public inputType: PlayerInputTypes = PlayerInputTypes.OR_OPTIONS;
    constructor(
      ...options: Array<PlayerInputs>
    ) {
      this.options = options;
    }
}
