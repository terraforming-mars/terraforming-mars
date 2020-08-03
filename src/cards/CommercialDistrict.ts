import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Game} from '../Game';
import {TileType} from '../TileType';
import {SelectSpace} from '../inputs/SelectSpace';
import {ISpace} from '../ISpace';
import { Resources } from '../Resources';
import { CardName } from '../CardName';
import { Board } from '../Board';

export class CommercialDistrict implements IProjectCard {
    public cost: number = 16;
    public tags: Array<Tags> = [Tags.STEEL];
    public name: CardName = CardName.COMMERCIAL_DISTRICT;
    public cardType: CardType = CardType.AUTOMATED;
    public hasRequirements = false;
    public canPlay(player: Player, game: Game): boolean {
      return player.getProduction(Resources.ENERGY) >= 1 &&
      game.board.getAvailableSpacesOnLand(player).length > 0;
    }
    public getVictoryPoints(_player: Player, game: Game) {
      const usedSpace = game.board.getSpaceByTileCard(this.name);
      if (usedSpace !== undefined) {
        return game.board.getAdjacentSpaces(usedSpace).filter(
            (adjacentSpace) => Board.isCitySpace(adjacentSpace)
        ).length;
      }
      return 0;
    }
    public play(player: Player, game: Game) {
      return new SelectSpace(
          'Select space for special tile',
          game.board.getAvailableSpacesOnLand(player),
          (foundSpace: ISpace) => {
            game.addTile(player, foundSpace.spaceType, foundSpace, {
              tileType: TileType.COMMERCIAL_DISTRICT,
              card: this.name
            });
            player.setProduction(Resources.ENERGY,-1);
            player.setProduction(Resources.MEGACREDITS,4);
            return undefined;
          }
      );
    }
}

