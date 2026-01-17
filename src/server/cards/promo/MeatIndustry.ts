import {IProjectCard} from '@/server/cards/IProjectCard';
import {Tag} from '@/common/cards/Tag';
import {Card} from '@/server/cards/Card';
import {CardName} from '@/common/cards/CardName';
import {CardType} from '@/common/cards/CardType';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {IPlayer} from '@/server/IPlayer';
import {ICard} from '@/server/cards/ICard';
import {CardResource} from '@/common/CardResource';
import {Resource} from '@/common/Resource';

export class MeatIndustry extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.MEAT_INDUSTRY,
      tags: [Tag.BUILDING],
      cost: 5,

      metadata: {
        cardNumber: 'X25',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you gain an animal to ANY CARD, gain 2 M€.', (eb) => {
            eb.resource(CardResource.ANIMAL).asterix().startEffect.megacredits(2);
          });
        }),
      },
    });
  }

  public onResourceAdded(player: IPlayer, card: ICard, count: number) {
    if (card.resourceType === CardResource.ANIMAL) {
      player.stock.add(Resource.MEGACREDITS, count * 2, {log: true});
    }
  }
}
