
import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Game} from '../Game';
import {TileType} from '../TileType';
import {SelectSpace} from '../inputs/SelectSpace';
import {SpaceType} from '../SpaceType';
import {ISpace} from '../ISpace';
import { Resources } from '../Resources';

export class Capital implements IProjectCard {
    public cost: number = 26;
    public tags: Array<Tags> = [Tags.CITY, Tags.STEEL];
    public cardType: CardType = CardType.AUTOMATED;
    public name: string = 'Capital';
    public canPlay(player: Player, game: Game): boolean {
      return player.getProduction(Resources.ENERGY) >= 2 &&
        game.getOceansOnBoard() >= 4 - player.getRequirementsBonus(game) &&
        game.getAvailableSpacesForCity(player).length >= 0;
    }
    public getVictoryPoints(_player: Player, game: Game) {
      const usedSpace = game.getSpaceByTileCard(this.name);
      if (usedSpace !== undefined) {
        return game.getAdjacentSpaces(usedSpace)
            .filter(
                (s) => s.tile !== undefined &&
                s.tile.tileType === TileType.OCEAN
            ).length;
      }
      return 0;
    }
    public play(player: Player, game: Game) {
      player.setProduction(Resources.ENERGY,-2);
      player.setProduction(Resources.MEGACREDITS,5);
      return new SelectSpace(
          'Select space for special city tile',
          game.getAvailableSpacesForCity(player),
          (space: ISpace) => {
            game.addCityTile(player, space.id, SpaceType.LAND, this.name);
            return undefined;
          }
      );
    }
}
