import {IPlayer} from '../IPlayer';
import {SelectSpace} from '../inputs/SelectSpace';
import {DeferredAction, Priority} from './DeferredAction';
import {PlacementType} from '../boards/PlacementType';

export class PlaceOceanTile extends DeferredAction {
  constructor(
    player: IPlayer,
    private options?: {
      on?: PlacementType,
      title?: string,
    }) {
    super(player, Priority.PLACE_OCEAN_TILE);
  }

  public execute() {
    if (!this.player.game.canAddOcean()) {
      return undefined;
    }

    const on = this.options?.on || 'ocean';
    const availableSpaces = this.player.game.board.getAvailableSpacesForType(this.player, on);
    const title = this.options?.title ?? this.getTitle(on);

    return new SelectSpace(title, availableSpaces)
      .andThen((space) => {
        this.player.game.addOcean(this.player, space);
        return undefined;
      });
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
