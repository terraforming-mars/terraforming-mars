import {Player} from '../../Player';
import {IActionCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Resources} from '../../../common/Resources';
import {CardName} from '../../../common/cards/CardName';
import {SelectPaymentDeferred} from '../../deferredActions/SelectPaymentDeferred';
import {CardRenderer} from '../render/CardRenderer';

export class SpaceMirrors extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.SPACE_MIRRORS,
      tags: [Tag.ENERGY, Tag.SPACE],
      cost: 3,

      metadata: {
        cardNumber: '076',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 7 M€ to increase your energy production 1 step.', (eb) => {
            eb.megacredits(7).startAction.production((pb) => pb.energy(1));
          });
        }),
      },
    });
  }
  public canAct(player: Player): boolean {
    return player.canAfford(7);
  }
  public action(player: Player) {
    player.game.defer(new SelectPaymentDeferred(player, 7, {title: 'Select how to pay for action'}));
    player.production.add(Resources.ENERGY, 1);
    return undefined;
  }
}
