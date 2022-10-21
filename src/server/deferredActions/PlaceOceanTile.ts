import {Player} from '../Player';
import {SelectSpace} from '../inputs/SelectSpace';
import {ISpace} from '../boards/ISpace';
import {DeferredAction, Priority} from './DeferredAction';
import {PlacementType} from '../boards/PlacementType';

export class PlaceOceanTile extends DeferredAction {
  constructor(
    player: Player,
    private options?: {
      type?: PlacementType,
      title?: string,
    }) {
    super(player, Priority.PLACE_OCEAN_TILE);
  }

  public execute() {
    if (!this.player.game.canAddOcean()) {
      return undefined;
    }

    const type = this.options?.type || 'ocean';
    const availableSpaces = this.player.game.board.getAvailableSpacesForType(this.player, type);
    const title = this.options?.title ?? this.getTitle(type);

    return new SelectSpace(
      title,
      availableSpaces,
      (space: ISpace) => {
        this.player.game.addOceanTile(this.player, space);
        return undefined;
      },
    );
  }

  private getTitle(type: PlacementType) {
    switch (type) {
    case 'ocean': return 'Select space for ocean tile';
    case 'land': return 'Select a land space to place an ocean tile';
    // case '': return 'Select space reserved for ocean to place greenery tile';
    default: throw new Error('unhandled type; ' + type);
    }
  }
}
