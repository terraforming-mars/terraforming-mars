// ============================================================
// Photoreflectors - B29
// Active: Spend 4 Energy to raise TR 1 step. 1 VP.
// ============================================================
import {ActionCard} from '../ActionCard';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {IProjectCard} from '../IProjectCard';

export class Photoreflectors extends ActionCard implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.PHOTOREFLECTORS,
      tags: [Tag.POWER, Tag.SPACE],
      cost: 18,
      victoryPoints: 1,

      action: {
        spend: {energy: 4},
        tr: 1,
      },

      metadata: {
        cardNumber: 'B29',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 4 Energy to raise your TR 1 step.', (ab) => {
            ab.energy(4).startAction.tr(1);
          });
        }),
      },
    });
  }
}
