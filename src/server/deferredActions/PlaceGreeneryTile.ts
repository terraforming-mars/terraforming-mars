import {Player} from '../Player';
import {SelectSpace} from '../inputs/SelectSpace';
import {ISpace} from '../boards/ISpace';
import {DeferredAction, Priority} from './DeferredAction';
import {PlacementType} from '../boards/PlacementType';

export class PlaceGreeneryTile extends DeferredAction {
  constructor(
    player: Player,
    private on: PlacementType = 'greenery',
  ) {
    super(player, Priority.DEFAULT);
  }

  public execute() {
    const availableSpaces = this.player.game.board.getAvailableSpacesForType(this.player, this.on);
    if (availableSpaces.length === 0) {
      return undefined;
    }

    return new SelectSpace(
      this.getTitle(),
      availableSpaces,
      (space: ISpace) => {
        this.player.game.addGreenery(this.player, space);
        return undefined;
      },
    );
  }

  private getTitle() {
    switch (this.on) {
    case 'greenery': return 'Select space for greenery tile';
    case 'ocean': return 'Select space reserved for ocean to place greenery tile';
    default: throw new Error('unhandled type; ' + this.on);
    }
  }
}
