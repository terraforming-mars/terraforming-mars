import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Tag} from '../../../common/cards/Tag';
import {CardResource} from '../../../common/CardResource';
import {Size} from '../../../common/cards/render/Size';

export class Whales extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.WHALES,
      cost: 10,
      tags: [Tag.ANIMAL],
      resourceType: CardResource.ANIMAL,
      victoryPoints: {resourcesHere: 1},
      requirements: {oceans: 6},

      metadata: {
        cardNumber: 'U88',
        renderData: CardRenderer.builder((b) => {
          b.effect('Whenever you would gain an ocean when there are already 9 oceans on the board, add an animal to this card',
            (b) => b.oceans(1).text('(9)', Size.SMALL, true).startEffect.resource(CardResource.ANIMAL));
        }),
        description: 'Requires 6 oceans. 1 VP for each animal on this card.',
      },
    });
  }
}
