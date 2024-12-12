import {IPlayer} from '../../IPlayer';
import {TileType} from '../../../common/TileType';
import {SpaceType} from '../../../common/boards/SpaceType';
import {BaseMilestone} from '../IMilestone';
import {Board} from '../../boards/Board';

export class TerraPioneer extends BaseMilestone {
  constructor() {
    super(
      'Terra Pioneer',
      'Own 5 tiles on Mars',
      5);
  }

  public getScore(player: IPlayer): number {
    // Don't simplify this to "space.tile?.tileType !== TileType.OCEAN"
    // Because that will make Land Claim a valid space for Landlord
    const marsSpaces = player.game.board.spaces
      .filter(Board.ownedBy(player))
      .filter(Board.hasRealTile)
      .filter((space) => space.tile?.tileType !== TileType.OCEAN && space.spaceType !== SpaceType.COLONY).length;

    return marsSpaces;
  }
}
