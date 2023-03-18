import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../CardRequirements';
import {ActionCard} from '../ActionCard';

export class LunaPoliticalInstitute extends ActionCard implements IProjectCard {
  constructor() {
    super({
      name: CardName.LUNA_POLITICAL_INSTITUTE,
      type: CardType.ACTIVE,
      tags: [Tag.MOON, Tag.EARTH],
      cost: 6,
      requirements: CardRequirements.builder((b) => b.tag(Tag.MOON, 2)),

      action: {
        turmoil: {
          sendDelegates: {count: 1},
        },
      },

      metadata: {
        description: 'Requires that you have 2 Moon tags.',
        cardNumber: 'M71',
        renderData: CardRenderer.builder((b) => {
          b.action(
            'Place one of your delegates in any party.',
            (eb) => eb.empty().startAction.delegates(1));
        }),
      },
    });
  }
}
