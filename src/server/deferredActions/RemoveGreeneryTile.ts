import {Player} from '../Player';
import {SelectSpace} from '../inputs/SelectSpace';
import {ISpace} from '../boards/ISpace';
import {DeferredAction, Priority} from './DeferredAction';
import {LogHelper} from '../LogHelper';

export class RemoveGreeneryTile extends DeferredAction {
  constructor(
    player: Player,
    public title: string = 'Select an Greenery tile to remove from board',
  ) {
    super(player, Priority.DEFAULT);
  }

  public execute() {
    // false: don't include upgraded oceans.
    const removableGreeneryTiles = this.player.game.board.getGreenerySpaces({evacuationZone: false, wetlands: false});
    if (removableGreeneryTiles.length === 0) {
      return undefined;
    }
    return new SelectSpace(
      this.title,
      removableGreeneryTiles,
      (space: ISpace) => {
        this.player.game.removeTile(space.id);
        LogHelper.logBoardTileAction(this.player, space, 'greenery tile', 'removed');
        return undefined;
      },
    );
  }
}
