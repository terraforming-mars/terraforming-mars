import {IProjectCard} from '../IProjectCard';
import {ActionCard} from '../ActionCard';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {played} from '../Options';

export class MirroredHeatExchangers extends ActionCard implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.MIRRORED_HEAT_EXCHANGERS,
      tags: [Tag.RADIATION],
      cost: 12,

      behavior: {
        stock: {plants:1, heat: 1},
      //  removeResourcesFromAnyCard: {microbe: 1},
      },

      action: {
        stock: {megacredits: {tag: Tag.SCIENCE}},
      },

      metadata: {
        cardNumber: 'X08',

        renderData: CardRenderer.builder((b) => {
          b.action('Gain 1 M€ per science tag you have.', (eb) => {
            eb.empty().startAction.megacredits(1).slash().science(1, {played});
          }).br;
          b.production((pb) => {
            pb.megacredits(-2);
          });
        }),
        description: 'Decrease your M€ production 2 steps.',
      },
    });
  }
}
