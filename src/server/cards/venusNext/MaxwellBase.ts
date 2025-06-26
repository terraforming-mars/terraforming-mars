import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {SpaceName} from '../../../common/boards/SpaceName';
import {IActionCard} from '../ICard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {ActionCard} from '../ActionCard';

export class MaxwellBase extends ActionCard implements IActionCard {
  constructor() {
    super({
      name: CardName.MAXWELL_BASE,
      type: CardType.ACTIVE,
      tags: [Tag.CITY, Tag.VENUS],
      cost: 18,

      action: {
        addResourcesToAnyCard: {
          tag: Tag.VENUS,
          count: 1,
          autoSelect: true,
          mustHaveCard: true,
        },
      },

      requirements: {venus: 12},
      victoryPoints: 3,
      behavior: {
        production: {energy: -1},
        city: {space: SpaceName.MAXWELL_BASE},
      },

      metadata: {
        cardNumber: '238',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 resource to ANOTHER VENUS CARD.', (eb) => {
            eb.empty().startAction.wild(1, {secondaryTag: Tag.VENUS});
          }).br;
          b.production((pb) => pb.minus().energy(1)).nbsp.city().asterix();
        }),
        description: {
          text: 'Requires Venus 12%. Decrease your energy production 1 step. Place a city tile ON THE RESERVED AREA.',
          align: 'left',
        },
      },
    });
  }
}
