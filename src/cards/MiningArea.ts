
import {Game} from '../Game';
import {Player} from '../Player';
import {TileType} from '../TileType';
import {CardName} from '../CardName';
import {MiningCard} from './MiningCard';

export class MiningArea extends MiningCard {
    public cost = 4;
    public name = CardName.MINING_AREA;
    protected getAvailableSpaces(player: Player, game: Game) {
      return super.getAvailableSpaces(player, game)
          .filter((space) => game.board.getAdjacentSpaces(space).filter((adjacentSpace) => adjacentSpace.tile !== undefined && adjacentSpace.tile.tileType !== TileType.OCEAN && adjacentSpace.player === player).length > 0);
    }
}
