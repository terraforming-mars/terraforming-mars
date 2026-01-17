import {IPlayer} from '@/server/IPlayer';
import {SelectSpace} from '@/server/inputs/SelectSpace';
import {DeferredAction} from '@/server/deferredActions/DeferredAction';
import {Priority} from '@/server/deferredActions/Priority';
import {LogHelper} from '@/server/LogHelper';

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
