import {Message} from '../../../common/logs/Message';
import {IColony} from '../../colonies/IColony';
import {IPlayer} from '../../IPlayer';
import { ColonyModel } from '../../../common/models/ColonyModel';
import { SelectionType } from '../../../common/input/SelectionType';
import { SelectionHandler } from './SelectionHandler';
import { colonyToModel } from '@/server/models/ModelUtils';

export class ColonySelection extends SelectionHandler<IColony> {
  // When true, show just the tile, and none of the cubes on top.
  // Used for tiles that are not yet in the game, or for a clearer
  // visualziation when necesary.
  public showTileOnly = false;

  constructor(
    title: string | Message,
    buttonLabel: string = 'Save',
    colonies: Array<IColony>,
  ) {
    super(colonies, SelectionType.COLONY, title, buttonLabel);
  }

  public override GetOptionName(option: IColony): string {
    return option.name;
  }

  public override OptionAsModel(option: IColony, player: IPlayer): ColonyModel {
    return colonyToModel(player.game, option, this.showTileOnly);
  }
}
