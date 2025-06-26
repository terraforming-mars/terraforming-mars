import {IPlayer} from '../IPlayer';
import {PlayerInput} from '../PlayerInput';
import {Space} from '../boards/Space';
import {RunNTimes} from '../deferredActions/RunNTimes';
import {SelectSpace} from '../inputs/SelectSpace';
import {SpaceType} from '../../common/boards/SpaceType';
import {LogHelper} from '../LogHelper';
import {AresHazards} from '../ares/AresHazards';
import {TileType} from '../../common/TileType';

export class ErodeSpacesDeferred extends RunNTimes<Space> {
  constructor(player: IPlayer, count: number) {
    super(player, count);
  }

  protected run(): PlayerInput | undefined {
    const game = this.player.game;

    const spaces: Set<Space> = new Set();
    for (const hazardTile of game.board.getHazards()) {
      for (const space of game.board.getAdjacentSpaces(hazardTile)) {
        if (space.spaceType === SpaceType.LAND && space.tile === undefined) {
          spaces.add(space);
        }
      }
    }

    if (spaces.size === 0) {
      return undefined;
    }

    return new SelectSpace('Select space to erode' + this.titleSuffix(), Array.from(spaces))
      .andThen((space) => {
        AresHazards.putHazardAt(space, TileType.EROSION_MILD);
        LogHelper.logBoardTileAction(this.player, space, 'space', 'eroded');
        game.grantSpaceBonuses(this.player, space);
        return this.next();
      });
  }
}
