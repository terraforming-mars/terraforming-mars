import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Tag} from '../../../common/cards/Tag';

export class FamilyConnections extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.FAMILY_CONNECTIONS,
      type: CardType.EVENT,
      cost: 12,
      tags: [Tag.CRIME],

      behavior: {
        underworld: {
          corruption: {tag: Tag.CITY},
        },
      },

      metadata: {
        cardNumber: 'U095',
        renderData: CardRenderer.builder((b) => {
          b.corruption(1).slash().tag(Tag.CITY);
        }),
        description: 'Gain 1 corruption for every city tag you have.',
      },
    });
  }
}
