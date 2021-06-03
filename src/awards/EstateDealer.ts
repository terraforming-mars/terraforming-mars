import {IAward} from './IAward';
import {Player} from '../Player';
import {isAresTile} from '../TileType';
import {Board} from '../boards/Board';

export class EstateDealer implements IAward {
    public name: string = 'Estate Dealer';
    public description: string = 'Most tiles adjacent to ocean tiles'
    public getScore(player: Player): number {
      return player.game.board.spaces.filter((space) =>
        space.player === player &&
        space.tile !== undefined &&
        isAresTile(space.tile.tileType) === false &&
        player.game.board.getAdjacentSpaces(space).some((space) => Board.isOceanSpace(space)),
      ).length;
    }
}
