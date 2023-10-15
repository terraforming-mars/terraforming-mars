import {IPlayer} from '../IPlayer';
import {SelectSpace} from '../inputs/SelectSpace';
import {DeferredAction, Priority} from './DeferredAction';
import {PlacementType} from '../boards/PlacementType';

export class PlaceGreeneryTile extends DeferredAction {
  constructor(
    player: IPlayer,
    private on: PlacementType = 'greenery',
  ) {
    super(player, Priority.DEFAULT);
  }

  public execute() {
    const availableSpaces = this.player.game.board.getAvailableSpacesForType(this.player, this.on);
    if (availableSpaces.length === 0) {
      return undefined;
    }

    return new SelectSpace(this.getTitle(), availableSpaces)
      .andThen((space) => {
        this.player.game.addGreenery(this.player, space);
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
