import {IProjectCard} from '@/server/cards/IProjectCard';
import {CardType} from '@/common/cards/CardType';
import {Tag} from '@/common/cards/Tag';
import {IPlayer} from '@/server/IPlayer';
import {CardName} from '@/common/cards/CardName';
import {Card} from '@/server/cards/Card';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {Size} from '@/common/cards/render/Size';

export class Conscription extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      cost: 5,
      tags: [Tag.EARTH],
      name: CardName.CONSCRIPTION,
      victoryPoints: -1,

      requirements: {tag: Tag.EARTH, count: 2},
      metadata: {
        cardNumber: 'C05',
        renderData: CardRenderer.builder((b) => {
          b.text('next card', Size.SMALL, true).colon().megacredits(-16);
        }),
        description: 'Requires 2 Earth tags. The next card you play this generation costs 16 M€ less.',
      },
    });
  }

  public override getCardDiscount(player: IPlayer) {
    if (player.lastCardPlayed === this.name) {
      return 16;
    }
    return 0;
  }
}
