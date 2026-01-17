import {IProjectCard, isIProjectCard} from '@/server/cards/IProjectCard';
import {Card} from '@/server/cards/Card';
import {CardName} from '@/common/cards/CardName';
import {CardType} from '@/common/cards/CardType';
import {Tag} from '@/common/cards/Tag';
import {IPlayer} from '@/server/IPlayer';
import {Resource} from '@/common/Resource';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {ICard} from '@/server/cards/ICard';

export class Advertising extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.ADVERTISING,
      tags: [Tag.EARTH],
      cost: 4,

      metadata: {
        cardNumber: 'X13',
        renderData: CardRenderer.builder((b) => b.effect('When you play a card with a basic cost of 20 M€ or more, increase your M€ production 1 step.', (be) => {
          be.megacredits(20).asterix().startEffect.production((pb) => pb.megacredits(1));
        })),
      },
    });
  }

  public onCardPlayed(player: IPlayer, card: ICard) {
    if (isIProjectCard(card) && card.cost >= 20) {
      player.production.add(Resource.MEGACREDITS, 1, {log: true});
    }
  }
}
