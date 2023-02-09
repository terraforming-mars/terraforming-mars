import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {IProjectCard} from '../IProjectCard';

export class NeutralizerFactory extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.NEUTRALIZER_FACTORY,
      cardType: CardType.AUTOMATED,
      tags: [Tag.VENUS],
      cost: 7,

      behavior: {
        global: {venus: 1},
      },

      requirements: CardRequirements.builder((b) => b.venus(10)),
      metadata: {
        cardNumber: '240',
        renderData: CardRenderer.builder((b) => {
          b.venus(1);
        }),
        description: 'Requires Venus 10%. Increase the Venus track 1 step.',
      },
    });
  }
}
