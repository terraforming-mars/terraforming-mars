import {Message} from '../../common/logs/Message';
import {BasePlayerInput, PlayerInput} from '../PlayerInput';
import {Space} from '../boards/Space';
import {InputResponse, isSelectSpaceResponse} from '../../common/inputs/InputResponse';
import {SelectSpaceModel} from '../../common/models/PlayerInputModel';

export class SelectSpace extends BasePlayerInput {
  public cb: (space: Space) => PlayerInput | undefined = () => undefined;

  constructor(
    title: string | Message,
    public spaces: ReadonlyArray<Space>) {
    super('space', title);
    if (spaces.length === 0) {
      throw new Error('No available spaces');
    }
  }

  public override toModel(): SelectSpaceModel {
    return {
      title: this.title,
      buttonLabel: this.buttonLabel,
      type: 'space',
      spaces: this.spaces.map((space) => space.id),
    };
  }

  public process(input: InputResponse) {
    if (!isSelectSpaceResponse(input)) {
      throw new Error('Not a valid SelectSpaceResponse');
    }
    const space = this.spaces.find(
      (space) => space.id === input.spaceId,
    );
    if (space === undefined) {
      throw new Error('Space not available');
    }
    return this.cb(space);
  }

  public andThen(cb: (space: Space) => PlayerInput | undefined): this {
    this.cb = cb;
    return this;
  }
}
