// ============================================================
// Underwater Outpost - B05
// Active: Req 2 Oceans. Action: draw 2 cards then discard 1. 2 VP.
// ============================================================
import {ActionCard} from '../ActionCard';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {IProjectCard} from '../IProjectCard';

export class UnderwaterOutpost extends ActionCard implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.UNDERWATER_OUTPOST,
      tags: [Tag.SCIENCE],
      cost: 27,
      victoryPoints: 2,

      requirements: {oceans: 2},

      action: {
        drawCard: {count: 2, keep: 1},
      },

      metadata: {
        cardNumber: 'B05',
        description: 'Requires 2 Oceans in play.',
        renderData: CardRenderer.builder((b) => {
          b.action('Draw 2 cards then discard 1.', (ab) => {
            ab.empty().startAction.cards(2).minus().cards(1);
          });
        }),
      },
    });
  }
}
