import {Player} from '../Player';
import {SelectSpace} from '../inputs/SelectSpace';
import {ISpace} from '../boards/ISpace';
import {DeferredAction, Priority} from './DeferredAction';
import {_AresHazardPlacement} from '../ares/AresHazards';
import {TileType} from '../../common/TileType';
import {PlacementType} from '../boards/PlacementType';


export class PlaceHazardTile extends DeferredAction {
  constructor(
    player: Player,
    private options?: {
      on?: PlacementType,
      title?: string,
      hazardType?: TileType,
    }) {
    super(player, Priority.DEFAULT);
  }

  public execute() {
    // TODO: Confirm, would this ever NOT be land?
    const type = this.options?.on || 'land';
    const availableSpaces = this.player.game.board.getAvailableSpacesForType(this.player, type);
    if (availableSpaces.length === 0) {
      return undefined;
    }
    const hazardType = this.options?.hazardType || Math.floor(Math.random() * 2) === 0 ? TileType.DUST_STORM_MILD : TileType.EROSION_MILD;
    const title = this.options?.title || 'Select space for ' + TileType.toString(hazardType);

    return new SelectSpace(
      title,
      availableSpaces,
      (space: ISpace) => {
        this.player.game.addHazardTile(this.player, space, hazardType);
        return undefined;
      },
    );
  }
}

