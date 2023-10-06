import {IPlayer} from '../IPlayer';
import {SelectSpace} from '../inputs/SelectSpace';
import {DeferredAction, Priority} from './DeferredAction';
import {_AresHazardPlacement} from '../ares/AresHazards';
import {TileType} from '../../common/TileType';

export class PlaceHazardTile extends DeferredAction {
  constructor(
    player: IPlayer,
    public hazardType: TileType.DUST_STORM_MILD | TileType.EROSION_MILD,
    private options?: {
      title?: string,
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
    const title = this.options?.title || 'Select space for ' + TileType.toString(hazardType);

    return new SelectSpace(title, availableSpaces)
      .andThen((space) => {
        _AresHazardPlacement.putHazardAt(space, hazardType);
        return undefined;
      });
  }
}

