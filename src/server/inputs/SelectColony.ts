import {Message} from '../../common/logs/Message';
import {BasePlayerInput} from '../PlayerInput';
import {IColony} from '../colonies/IColony';
import {InputResponse, isSelectColonyResponse} from '../../common/inputs/InputResponse';
import {SelectColonyModel} from '../../common/models/PlayerInputModel';
import {coloniesToModel} from '../models/ModelUtils';
import {IPlayer} from '../IPlayer';
import {InputError} from './InputError';

export class SelectColony extends BasePlayerInput<IColony> {
  // When true, show just the tile, and none of the cubes on top.
  // Used for tiles that are not yet in the game, or for a clearer
  // visualziation when necesary.
  public showTileOnly = false;

  constructor(
    title: string | Message,
    buttonLabel: string = 'Save',
    public colonies: Array<IColony>,
  ) {
    super('colony', title);
    this.buttonLabel = buttonLabel;
  }

  public toModel(player: IPlayer): SelectColonyModel {
    return {
      title: this.title,
      buttonLabel: this.buttonLabel,
      type: 'colony',
      coloniesModel: coloniesToModel(player.game, this.colonies, this.showTileOnly),
    };
  }

  public process(input: InputResponse) {
    if (!isSelectColonyResponse(input)) {
      throw new InputError('Not a valid SelectColonyResponse');
    }
    if (input.colonyName === undefined) {
      throw new InputError('No colony selected');
    }
    const colony = this.colonies.find((c) => c.name === input.colonyName);
    if (colony === undefined) {
      throw new InputError(`Colony ${input.colonyName} not found`);
    }
    return this.cb(colony);
  }
}
