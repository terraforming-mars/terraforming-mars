
import {Message} from '../common/logs/Message';
import {OrOptions} from './OrOptions';
import {PlayerInput} from '../PlayerInput';
import {ISpace} from '../boards/ISpace';
import {PlayerInputTypes} from '../common/input/PlayerInputTypes';
import {InputResponse} from '../common/inputs/InputResponse';
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

  public process(input: InputResponse, player: Player) {
    player.checkInputLength(input, 1, 1);
    const space = this.availableSpaces.find(
      (space) => space.id === input[0][0],
    );
    if (space === undefined) {
      throw new Error('Space not available');
    }
    return this.cb(space);
  }
}
