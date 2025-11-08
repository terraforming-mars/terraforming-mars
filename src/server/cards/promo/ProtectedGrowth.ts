import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {max} from '../Options';

export class ProtectedGrowth extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.PROTECTED_GROWTH,
      cost: 2,
      tags: [Tag.PLANT],

      behavior: {
        stock: {plants: {tag: Tag.POWER}},
      },

      requirements: {oxygen: 7, max},
      metadata: {
        cardNumber: 'X73',
        renderData: CardRenderer.builder((b) => b.plants(1).slash().tag(Tag.POWER)),
        description: 'Oxygen must be 7% or less. Gain 1 plant per power tag you have.',
      },
    });
  }
}
