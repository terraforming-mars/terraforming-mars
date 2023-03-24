import {IActionCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {digit} from '../Options';

export class Meltworks extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.MELTWORKS,
      tags: [Tag.BUILDING],
      cost: 4,

      // When you're ready.
      // action: {
      //   spend: {heat: 5},
      //   stock: {steel: 3},
      // },

      metadata: {
        cardNumber: 'X26',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 5 heat to gain 3 steel.', (eb) => {
            eb.heat(5, {digit}).startAction.steel(3);
          });
        }),
      },
    });
  }

  public canAct(player: Player): boolean {
    return player.availableHeat() >= 5;
  }
  public action(player: Player) {
    return player.spendHeat(5, () => {
      player.steel += 3;
      return undefined;
    });
  }
}
