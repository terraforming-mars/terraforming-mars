import {Player} from '../../Player';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {SelectSpace} from '../../inputs/SelectSpace';
import {TileType} from '../../../common/TileType';
import {ISpace} from '../../boards/ISpace';
import {CardRenderer} from '../render/CardRenderer';
import {digit} from '../Options';

export class MagneticFieldGeneratorsPromo extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.MAGNETIC_FIELD_GENERATORS_PROMO,
      tags: [Tag.BUILDING],
      cost: 22,

      behavior: {
        production: {energy: -4, plants: 2},
        tr: 3,
      },

      metadata: {
        cardNumber: 'X33',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().energy(4, {digit}).br;
            pb.plus().plants(2);
          }).br;
          b.tr(3, {digit}).tile(TileType.MAGNETIC_FIELD_GENERATORS, true).asterix();
        }),
        description: 'Decrease your energy production 4 steps and increase your plant production 2 steps. Raise your TR 3 steps.',
      },
    });
  }
  public override bespokeCanPlay(player: Player): boolean {
    return player.game.board.getAvailableSpacesOnLand(player).length > 0;
  }
  public override bespokePlay(player: Player) {
    const availableSpaces = player.game.board.getAvailableSpacesOnLand(player);
    if (availableSpaces.length < 1) return undefined;

    return new SelectSpace('Select space for tile', availableSpaces, (space: ISpace) => {
      player.game.addTile(player, space.spaceType, space, {tileType: TileType.MAGNETIC_FIELD_GENERATORS});
      return undefined;
    });
  }
}
