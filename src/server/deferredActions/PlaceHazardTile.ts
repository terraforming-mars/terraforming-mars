import {IPlayer} from '../IPlayer';
import {SelectSpace} from '../inputs/SelectSpace';
import {DeferredAction} from './DeferredAction';
import {Priority} from './Priority';
import {_AresHazardPlacement} from '../ares/AresHazards';
import {TileType} from '../../common/TileType';
import {Message} from '../../common/logs/Message';
import {message} from '../logs/MessageBuilder';

export class PlaceHazardTile extends DeferredAction {
  constructor(
    player: IPlayer,
    public hazardType: TileType.DUST_STORM_MILD | TileType.EROSION_MILD,
    private options?: {
      title?: string | Message,
    }) {
    super(player, Priority.DEFAULT);
  }

  public execute() {
    const type = 'land';
    const availableSpaces = this.player.game.board.getAvailableSpacesForType(this.player, type);
    if (availableSpaces.length === 0) {
      return undefined;
    }
    const hazardType = this.hazardType;
    const title = this.options?.title || message('Select space for ${0}', (b) => b.tileType(hazardType));

    return new SelectSpace(title, availableSpaces)
      .andThen((space) => {
        _AresHazardPlacement.putHazardAt(space, hazardType);
        return undefined;
      });
  }
}

