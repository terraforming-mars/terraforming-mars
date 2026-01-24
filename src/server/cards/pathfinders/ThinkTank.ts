import {CardRenderer} from '../render/CardRenderer';
import {CardName} from '../../../common/cards/CardName';
import {CardResource} from '../../../common/CardResource';
import {Tag} from '../../../common/cards/Tag';
import {ActionCard} from '../ActionCard';
import {CardType} from '../../../common/cards/CardType';
import {Size} from '../../../common/cards/render/Size';

export class ThinkTank extends ActionCard {
  constructor() {
    super({
      name: CardName.THINK_TANK,
      type: CardType.ACTIVE,
      cost: 12,
      tags: [Tag.MARS, Tag.VENUS, Tag.SCIENCE],
      resourceType: CardResource.DATA,

      action: {
        spend: {megacredits: 2},
        addResourcesToAnyCard: {count: 1, type: CardResource.DATA},
      },

      metadata: {
        cardNumber: 'Pf49',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 2 M€ to place 1 data on any card.', (ab) => {
            ab.megacredits(2).startAction.resource(CardResource.DATA).asterix();
          }).br;
          b.effect(
            'When playing a card, you can remove data from this card to ' +
            'change the card\'s global requirement by 1 step for every 1 data removed.',
            (eb) => eb.resource(CardResource.DATA).startEffect.text('+/-1 global parameter', Size.SMALL));
        }),
      },
    });
  }

  public override resourceCount = 0;
}

