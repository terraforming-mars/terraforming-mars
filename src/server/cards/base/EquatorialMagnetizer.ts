import {Tag} from '../../../common/cards/Tag';
import {ActionCard} from '../ActionCard';
import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class EquatorialMagnetizer extends ActionCard implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.EQUATORIAL_MAGNETIZER,
      tags: [Tag.BUILDING],
      cost: 11,

      action: {
        production: {energy: -1},
        tr: 1,
      },

      metadata: {
        cardNumber: '015',
        renderData: CardRenderer.builder((b) => {
          b.action('Decrease your energy production 1 step to increase your terraform rating 1 step.', (eb) => {
            eb.production((pb) => pb.energy(1)).startAction.tr(1);
          });
        }),
      },
    });
  }
}

