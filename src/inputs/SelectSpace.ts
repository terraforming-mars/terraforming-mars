
import {Message} from '../Message';
import {OrOptions} from './OrOptions';
import {PlayerInput} from '../PlayerInput';
import {ISpace} from '../boards/ISpace';
import {PlayerInputTypes} from '../PlayerInputTypes';

export class SelectSpace implements PlayerInput {
    public inputType: PlayerInputTypes = PlayerInputTypes.SELECT_SPACE;
    public buttonLabel: string = 'Save'; // not used (for now)
    constructor(
        public title: string | Message,
        public availableSpaces: Array<ISpace>,
        public cb: (space: ISpace) => OrOptions | SelectSpace | undefined) {
      if (availableSpaces.length === 0) {
        throw new Error('No available spaces');
      }
    }
}
