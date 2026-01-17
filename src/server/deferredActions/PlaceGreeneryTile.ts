import {IPlayer} from '@/server/IPlayer';
import {SelectSpace} from '@/server/inputs/SelectSpace';
import {DeferredAction} from '@/server/deferredActions/DeferredAction';
import {Priority} from '@/server/deferredActions/Priority';
import {PlacementType} from '@/server/boards/PlacementType';
import {Space} from '@/server/boards/Space';

export class PlaceGreeneryTile extends DeferredAction<Space | undefined> {
  constructor(
    player: IPlayer,
    private on: PlacementType = 'greenery',
  ) {
    super(player, Priority.DEFAULT);
  }

  public execute() {
    const board = this.player.game.board;
    const spacesForType = board.getAvailableSpacesForType(this.player, this.on);
    const filtered = board.filterSpacesAroundRedCity(spacesForType);
    if (filtered.length === 0) {
      this.cb(undefined);
      return undefined;
    }

    return new SelectSpace(this.getTitle(), filtered)
      .andThen((space) => {
        this.player.game.addGreenery(this.player, space);
        this.cb(space);
        return undefined;
      });
  }

  private getTitle() {
    switch (this.on) {
    case 'greenery': return 'Select space for greenery tile';
    case 'ocean': return 'Select space reserved for ocean to place greenery tile';
    default: throw new Error('unhandled type; ' + this.on);
    }
  }
}
