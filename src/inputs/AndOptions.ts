import {PlayerInput} from '../PlayerInput';
import {PlayerInputTypes} from '../PlayerInputTypes';
import {PlayerInputs} from './PlayerInputs';

export class AndOptions implements PlayerInput {
    public inputType: PlayerInputTypes = PlayerInputTypes.AND_OPTIONS;
    public title = '';
    public buttonLabel: string = 'Save';
    public options: Array<PlayerInput>;
    constructor(public cb: () => PlayerInput | undefined, ...options: Array<PlayerInputs>) {
      this.options = options;
    }
}
