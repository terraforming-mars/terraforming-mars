import {IAward} from './IAward';
import {Player} from '../Player';
import {Game} from '../Game';
import {Board} from '../boards/Board';

export class EstateDealer implements IAward {
    public name: string = 'Estate Dealer';
    public description: string = 'Most tiles adjacent to ocean tiles'
    public getScore(player: Player, game: Game): number {
      return game.board.spaces
        .filter((space) => (space.player !== undefined && space.player === player && space.tile !== undefined) &&
                               game.board.getAdjacentSpaces(space)
                                 .filter((space) => Board.isOceanSpace(space)).length > 0,
        ).length;
    }
}
