import {IProjectCard} from '@/server/cards/IProjectCard';
import {Tag} from '@/common/cards/Tag';
import {Card} from '@/server/cards/Card';
import {CardType} from '@/common/cards/CardType';
import {IPlayer} from '@/server/IPlayer';
import {CardName} from '@/common/cards/CardName';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {GainResources} from '@/server/deferredActions/GainResources';
import {Resource} from '@/common/Resource';
import {ICard} from '@/server/cards/ICard';

export class MediaGroup extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.MEDIA_GROUP,
      tags: [Tag.EARTH],
      cost: 6,

      metadata: {
        cardNumber: '109',
        renderData: CardRenderer.builder((b) => {
          b.effect('After you play an event card, you gain 3 M€.', (eb) => {
            eb.tag(Tag.EVENT).startEffect.megacredits(3);
          });
        }),
      },
    });
  }

  public onCardPlayed(player: IPlayer, card: ICard) {
    if (card.type === CardType.EVENT) {
      player.game.defer(new GainResources(player, Resource.MEGACREDITS, {count: 3, log: true}));
    }
  }
}
