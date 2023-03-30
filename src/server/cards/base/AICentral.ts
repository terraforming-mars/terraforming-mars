import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {ActionCard} from '../ActionCard';

export class AICentral extends ActionCard implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.AI_CENTRAL,
      tags: [Tag.SCIENCE, Tag.BUILDING],
      cost: 21,

      behavior: {
        production: {energy: -1},
      },

      action: {
        drawCard: {count: 2},
      },

      victoryPoints: 1,

      requirements: CardRequirements.builder((b) => b.tag(Tag.SCIENCE, 3)),
      metadata: {
        description: {
          text: 'Requires 3 science tags to play. Decrease your energy production 1 step.',
          align: 'left',
        },
        cardNumber: '208',
        renderData: CardRenderer.builder((b) => {
          b.action('Draw 2 cards.', (ab) => ab.empty().startAction.cards(2)).br;
          b.production((pb) => pb.minus().energy(1));
        }),
      },
    });
  }
}
