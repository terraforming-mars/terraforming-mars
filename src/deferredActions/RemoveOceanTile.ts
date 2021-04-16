import {Player} from '../Player';
import {SelectSpace} from '../inputs/SelectSpace';
import {ISpace} from '../boards/ISpace';
import {DeferredAction, Priority} from './DeferredAction';
import {LogHelper} from '../LogHelper';

export class RemoveOceanTile implements DeferredAction {
  public priority = Priority.DEFAULT;
  constructor(
        public player: Player,
        public title: string = 'Select an Ocean tile to remove from board',
  ) {}

  public execute() {
    if (this.player.game.board.getOceansOnBoard() === 0) {
      return undefined;
    }
    return new SelectSpace(
      this.title,
      // false: don't include upgraded oceans.
      this.player.game.board.getOceansTiles(false),
      (space: ISpace) => {
        this.player.game.removeTile(space.id);
        LogHelper.logBoardTileAction(this.player, space, 'ocean tile', 'removed');
        return undefined;
      },
    );
  }
}
