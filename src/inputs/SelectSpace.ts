
import {Message} from '../Message';
import {OrOptions} from './OrOptions';
import {PlayerInput} from '../PlayerInput';
import {ISpace} from '../boards/ISpace';
import {PlayerInputTypes} from '../PlayerInputTypes';
import {Player} from '../Player';

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
    public runInput(player: Player, input: ReadonlyArray<ReadonlyArray<string>>) {
      PlayerInput.checkInputLength(input, 1, 1);
      const foundSpace = this.availableSpaces.find(
        (space) => space.id === input[0][0],
      );
      if (foundSpace === undefined) {
        throw new Error('Space not available');
      }
      player.runInputCb(this.cb(foundSpace));
    }
}
