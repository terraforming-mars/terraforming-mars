import {Game} from '../Game';
import {Player} from '../Player';
import {SelectSpace} from '../inputs/SelectSpace';
import {ISpace} from '../boards/ISpace';
import {DeferredAction} from './DeferredAction';
import {LogHelper} from '../LogHelper';

export class RemoveOceanTile implements DeferredAction {
  constructor(
        public player: Player,
        public game: Game,
        public title: string = 'Select an Ocean tile to remove from board',
  ) {}

  public execute() {
    if (this.game.board.getOceansOnBoard() === 0) {
      return undefined;
    }
    return new SelectSpace(
      this.title,
      // false: don't include upgraded oceans.
      this.game.board.getOceansTiles(false),
      (space: ISpace) => {
        this.game.removeTile(space.id);
        LogHelper.logBoardTileAction(this.game, this.player, space, 'ocean space', 'removed');
        return undefined;
      },
    );
  }
}
