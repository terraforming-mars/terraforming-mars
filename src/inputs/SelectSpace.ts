
import {DynamicTranslatableStringModel} from '../models/DynamicTranslatableStringModel';
import {OrOptions} from './OrOptions';
import {PlayerInput} from '../PlayerInput';
import {ISpace} from '../ISpace';
import {PlayerInputTypes} from '../PlayerInputTypes';

export class SelectSpace implements PlayerInput {
    public inputType: PlayerInputTypes = PlayerInputTypes.SELECT_SPACE;
    public buttonLabel: string = 'Save'; // not used (for now)
    constructor(
        public title: string | DynamicTranslatableStringModel,
        public availableSpaces: Array<ISpace>,
        public cb: (space: ISpace) => OrOptions | SelectSpace | undefined) {
      if (availableSpaces.length === 0) {
        throw 'No available spaces';
      }
    }
}
