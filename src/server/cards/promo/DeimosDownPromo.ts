import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../../common/cards/CardName';
import {SelectSpace} from '../../inputs/SelectSpace';
import {TileType} from '../../../common/TileType';
import {ISpace} from '../../boards/ISpace';
import {CardRenderer} from '../render/CardRenderer';
import {all, digit} from '../Options';

export class DeimosDownPromo extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.DEIMOS_DOWN_PROMO,
      tags: [Tag.SPACE],
      cost: 31,

      behavior: {
        stock: {steel: 4},
        global: {temperature: 3},
        removeAnyPlants: 6,
      },

      metadata: {
        cardNumber: 'X31',
        description: 'Raise temperature 3 steps and gain 4 steel. Place this tile ADJACENT TO no other city tile. Remove up to 6 plants from any player.',
        renderData: CardRenderer.builder((b) => {
          b.temperature(3).br;
          b.tile(TileType.DEIMOS_DOWN, true).asterix().br;
          b.steel(4, {digit}).nbsp.minus().plants(-6, {all});
        }),
      },
    });
  }

  public override bespokeCanPlay(player: Player): boolean {
    return player.game.board.getAvailableSpacesForCity(player).length > 0;
  }

  public override bespokePlay(player: Player) {
    const availableSpaces = player.game.board.getAvailableSpacesForCity(player);

    return new SelectSpace('Select space for tile', availableSpaces, (space: ISpace) => {
      player.game.addTile(player, space.spaceType, space, {tileType: TileType.DEIMOS_DOWN});
      return undefined;
    });
  }
}
