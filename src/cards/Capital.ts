import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Game} from '../Game';
import {TileType} from '../TileType';
import {SelectSpace} from '../inputs/SelectSpace';
import {SpaceType} from '../SpaceType';
import {ISpace} from '../ISpace';
import {Resources} from '../Resources';
import {CardName} from '../CardName';
import {IAdjacencyBonus} from '../ares/IAdjacencyBonus';
import {Board} from '../Board';

export class Capital implements IProjectCard {
    public cost = 26;
    public tags = [Tags.CITY, Tags.STEEL];
    public cardType = CardType.AUTOMATED;
    public name = CardName.CAPITAL;
    public adjacencyBonus?: IAdjacencyBonus = undefined;

    public canPlay(player: Player, game: Game): boolean {
      return player.getProduction(Resources.ENERGY) >= 2 &&
        game.board.getOceansOnBoard() >= 4 - player.getRequirementsBonus(game) &&
        game.board.getAvailableSpacesForCity(player).length > 0;
    }
    public getVictoryPoints(_player: Player, game: Game) {
      const usedSpace = game.board.getSpaceByTileCard(this.name);
      if (usedSpace !== undefined) {
        return game.board.getAdjacentSpaces(usedSpace)
          .filter((s) => Board.isOceanSpace(s)).length;
      }
      return 0;
    }
    public play(player: Player, game: Game) {
      player.addProduction(Resources.ENERGY, -2);
      player.addProduction(Resources.MEGACREDITS, 5);
      return new SelectSpace(
        'Select space for special city tile',
        game.board.getAvailableSpacesForCity(player),
        (space: ISpace) => {
          game.addTile(player, SpaceType.LAND, space, {
            tileType: TileType.CAPITAL,
            card: this.name,
          });
          space.adjacency = this.adjacencyBonus;
          return undefined;
        },
      );
    }
}
