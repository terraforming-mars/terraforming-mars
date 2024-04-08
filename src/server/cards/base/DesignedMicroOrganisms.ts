import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {max} from '../Options';

export class DesignedMicroOrganisms extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.DESIGNED_MICROORGANISMS,
      tags: [Tag.SCIENCE, Tag.MICROBE],
      cost: 16,

      behavior: {
        production: {plants: 2},
      },

      requirements: {temperature: -14, max},
      metadata: {
        cardNumber: '155',
        description: 'It must be -14 C or colder. Increase your plant production 2 steps.',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.plants(2));
        }),
      },
    });
  }
}
