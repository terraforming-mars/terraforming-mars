
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {SelectSpace} from '../../inputs/SelectSpace';
import {ISpace} from '../../boards/ISpace';
import {CardName} from '../../../common/cards/CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {max} from '../Options';

export class CupolaCity extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.CUPOLA_CITY,
      tags: [Tag.CITY, Tag.BUILDING],
      cost: 16,
      productionBox: {energy: -1, megacredits: 3},

      requirements: CardRequirements.builder((b) => b.oxygen(9, {max})),
      metadata: {
        cardNumber: '029',
        description: 'Oxygen must be 9% or less. Place a City tile. Decrease your Energy production 1 step and increase your M€ production 3 steps.',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().energy(1).br;
            pb.plus().megacredits(3);
          }).nbsp.nbsp.city();
        }),
      },
    });
  }
  public override bespokeCanPlay(player: Player): boolean {
    return player.game.board.getAvailableSpacesForCity(player).length > 0;
  }
  public override bespokePlay(player: Player) {
    return new SelectSpace(
      'Select a space for city tile',
      player.game.board.getAvailableSpacesForCity(player),
      (space: ISpace) => {
        player.game.addCityTile(player, space.id);
        return undefined;
      },
    );
  }
}
