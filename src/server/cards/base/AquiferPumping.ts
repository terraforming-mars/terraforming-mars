import {IActionCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {ActionCard} from '../ActionCard';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class AquiferPumping extends ActionCard implements IActionCard, IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.AQUIFER_PUMPING,
      tags: [Tag.BUILDING],
      cost: 18,

      action: {
        spend: {megacredits: 8, canUseSteel: true},
        ocean: {},
      },

      metadata: {
        cardNumber: '187',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 8 M€ to place 1 ocean tile. STEEL MAY BE USED as if you were playing a building card.',
            (eb) => eb.megacredits(8).super((b) => b.steel(1)).startAction.oceans(1));
        }),
      },
    });
  }
}
