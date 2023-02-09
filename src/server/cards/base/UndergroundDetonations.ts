import {IActionCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {Resources} from '../../../common/Resources';
import {CardName} from '../../../common/cards/CardName';
import {SelectPaymentDeferred} from '../../deferredActions/SelectPaymentDeferred';
import {CardRenderer} from '../render/CardRenderer';

export class UndergroundDetonations extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.UNDERGROUND_DETONATIONS,
      tags: [Tag.BUILDING],
      cost: 6,

      metadata: {
        cardNumber: '202',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 10M€ to increase your heat production 2 steps.', (eb) => {
            eb.megacredits(10).startAction.production((pb)=>pb.heat(2));
          });
        }),
      },
    });
  }
  public canAct(player: Player): boolean {
    return player.canAfford(10);
  }
  public action(player: Player) {
    player.game.defer(new SelectPaymentDeferred(player, 10, {title: 'Select how to pay for action'}));
    player.production.add(Resources.HEAT, 2);
    return undefined;
  }
}
