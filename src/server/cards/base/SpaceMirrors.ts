import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {ActionCard} from '../ActionCard';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class SpaceMirrors extends ActionCard implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.SPACE_MIRRORS,
      tags: [Tag.POWER, Tag.SPACE],
      cost: 3,

      action: {
        spend: {megacredits: 7},
        production: {energy: 1},
      },

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
}
