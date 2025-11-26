import {CardType} from '@/common/cards/CardType';
import {IProjectCard} from '@/server/cards/IProjectCard';
import {CardName} from '@/common/cards/CardName';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {Card} from '@/server/cards/Card';
import {IPlayer} from '@/server/IPlayer';
import {Tag} from '@/common/cards/Tag';
import {Resource} from '@/common/Resource';
import {all} from '@/server/cards/Options';
import {ICard} from '@/server/cards/ICard';

export class DetectiveTVSeries extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.DETECTIVE_TV_SERIES,
      type: CardType.ACTIVE,
      cost: 5,
      tags: [Tag.EARTH],

      metadata: {
        cardNumber: 'U091',
        renderData: CardRenderer.builder((b) => {
          b.effect('Whenever ANY player plays a crime tag, you gain 2 MC.', (ab) => {
            ab.tag(Tag.CRIME, {all}).startEffect.megacredits(2);
          });
        }),
      },
    });
  }

  onCardPlayedByAnyPlayer(thisCardOwner: IPlayer, card: ICard) {
    const count = card.tags.filter((tag) => tag === Tag.CRIME).length;
    thisCardOwner.stock.add(Resource.MEGACREDITS, 2 * count, {log: true, from: {card: card}});
    return undefined;
  }
}
