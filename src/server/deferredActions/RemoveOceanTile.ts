import {IPlayer} from '../IPlayer';
import {SelectSpace} from '../inputs/SelectSpace';
import {DeferredAction, Priority} from './DeferredAction';
import {LogHelper} from '../LogHelper';

export class RemoveOceanTile extends DeferredAction {
  constructor(
    player: IPlayer,
    public title: string = 'Select an Ocean tile to remove from board',
  ) {
    super(player, Priority.DEFAULT);
  }

  public execute() {
    // false: don't include upgraded oceans.
    const removableOceanTiles = this.player.game.board.getOceanSpaces({upgradedOceans: false});
    if (removableOceanTiles.length === 0) {
      return undefined;
    }
    return new SelectSpace(this.title, removableOceanTiles)
      .andThen((space) => {
        this.player.game.removeTile(space.id);
        LogHelper.logBoardTileAction(this.player, space, 'ocean tile', 'removed');
        return undefined;
      });
  }
}
