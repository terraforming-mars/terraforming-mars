import {Message} from '../../common/logs/Message';
import {PlayerInput} from '../PlayerInput';
import {ISpace} from '../boards/ISpace';
import {PlayerInputType} from '../../common/input/PlayerInputType';
import {InputResponse, isSelectSpaceResponse} from '../../common/inputs/InputResponse';

export class SelectSpace implements PlayerInput {
  public readonly inputType = PlayerInputType.SELECT_SPACE;
  public buttonLabel: string = 'Save'; // not used (for now)
  constructor(
        public title: string | Message,
        public availableSpaces: Array<ISpace>,
        public cb: (space: ISpace) => PlayerInput | undefined) {
    if (availableSpaces.length === 0) {
      throw new Error('No available spaces');
    }
  }

  public process(input: InputResponse) {
    if (!isSelectSpaceResponse(input)) {
      throw new Error('Not a valid SelectSpaceResponse');
    }
    const space = this.availableSpaces.find(
      (space) => space.id === input.spaceId,
    );
    if (space === undefined) {
      throw new Error('Space not available');
    }
    return this.cb(space);
  }
}
