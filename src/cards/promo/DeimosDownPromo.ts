import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import { CardName } from '../../CardName';
import { Resources } from '../../Resources';
import { SelectSpace } from '../../inputs/SelectSpace';
import { TileType } from '../../TileType';
import { ISpace } from '../../ISpace';

export class DeimosDownPromo implements IProjectCard {
    public cost: number = 31;
    public tags: Array<Tags> = [Tags.SPACE];
    public name: CardName = CardName.DEIMOS_DOWN_PROMO;
    public cardType: CardType = CardType.EVENT;

    public canPlay(player: Player, game: Game) {
      const canPlaceTile = game.board.getAvailableSpacesForCity(player).length > 0;
      return canPlaceTile;
    }

    public play(player: Player, game: Game) {
      game.increaseTemperature(player, 3);
      game.addResourceDecreaseInterrupt(player, Resources.PLANTS, 6);
      player.steel += 4;

      const availableSpaces = game.board.getAvailableSpacesForCity(player);
      
      return new SelectSpace("Select space for tile", availableSpaces, (foundSpace: ISpace) => {
        game.addTile(player, foundSpace.spaceType, foundSpace, { tileType: TileType.DEIMOS_DOWN });
        return undefined;
      });
    }
}
