import {Message} from '../../common/logs/Message';
import {BasePlayerInput, PlayerInput} from '../PlayerInput';
import {PlayerInputType} from '../../common/input/PlayerInputType';
import {IColony} from '../colonies/IColony';
import {InputResponse, isSelectColonyResponse} from '../../common/inputs/InputResponse';

export class SelectColony extends BasePlayerInput {
  // When true, show just the tile, and none of the cubes on top.
  // Used for tiles that are not yet in the game, or for a clearer
  // visualziation when necesary.
  public showTileOnly = false;

  constructor(
    title: string | Message,
    buttonLabel: string = 'Save',
    public colonies: Array<IColony>,
    public cb: (colony: IColony) => PlayerInput | undefined,
  ) {
    super(PlayerInputType.SELECT_COLONY, title);
    this.buttonLabel = buttonLabel;
  }

  public process(input: InputResponse) {
    if (!isSelectColonyResponse(input)) {
      throw new Error('Not a valid SelectColonyResponse');
    }
    if (input.colonyName === undefined) {
      throw new Error('No colony selected');
    }
    const colony = this.colonies.find((c) => c.name === input.colonyName);
    if (colony === undefined) {
      throw new Error(`Colony ${input.colonyName} not found`);
    }
    return this.cb(colony);
  }
}
