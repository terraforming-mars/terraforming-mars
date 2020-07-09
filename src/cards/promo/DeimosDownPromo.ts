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

    public play(player: Player, game: Game) {
      game.increaseTemperature(player, 3);
      game.addResourceDecreaseInterrupt(player, Resources.PLANTS, 6);
      player.steel += 4;

      const availableSpaces = game.board.getAvailableSpacesForCity(player);
      if (availableSpaces.length < 1) return undefined;
      
      return new SelectSpace("Select space for tile", availableSpaces, (foundSpace: ISpace) => {
        game.addTile(player, foundSpace.spaceType, foundSpace, { tileType: TileType.DEIMOS_DOWN });
        return undefined;
      });
    }
}
