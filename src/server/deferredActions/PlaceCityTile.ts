import {Player} from '../Player';
import {SelectSpace} from '../inputs/SelectSpace';
import {ISpace} from '../boards/ISpace';
import {DeferredAction, Priority} from './DeferredAction';
import {PlacementType} from '../boards/PlacementType';

export class PlaceCityTile extends DeferredAction {
  constructor(
    player: Player,
    private options?: {
      on?: PlacementType,
      title?: string,
      spaces?: ReadonlyArray<ISpace>,
    }) {
    super(player, Priority.DEFAULT);
  }

  public execute() {
    const type = this.options?.on || 'city';
    const spaces = this.options?.spaces || this.player.game.board.getAvailableSpacesForType(this.player, type);
    const title = this.options?.title ?? this.getTitle(type);

    if (spaces.length === 0) {
      return undefined;
    }
    return new SelectSpace(
      title,
      spaces,
      (space: ISpace) => {
        this.player.game.addCity(this.player, space);
        return undefined;
      },
    );
  }

  private getTitle(type: PlacementType) {
    switch (type) {
    case 'city': return 'Select space for city tile';
    case 'isolated': return 'Select place next to no other tile for city';
    // case '': return 'Select space reserved for ocean to place greenery tile';
    default: throw new Error('unhandled type; ' + type);
    }
  }
}
