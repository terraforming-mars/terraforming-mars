import { Card } from '../Card';
import { CardType } from '../../../common/cards/CardType';
import { IProjectCard } from '../IProjectCard';
import { CardName } from '../../../common/cards/CardName';
import { CardRenderer } from '../render/CardRenderer';
import { Size } from '../../../common/cards/render/Size';
import { Tag } from '../../../common/cards/Tag';
import { Player } from '../../Player';

export class FakeMediaConference extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.FAKE_MEDIA_CONFERENCE,
      tags: [Tag.EARTH],
      cost: 4,

      metadata: {
        cardNumber: 'N29',
        renderData: CardRenderer.builder((b) => {
          b.text('next Standard Project', Size.SMALL, true).colon().megacredits(-8);
        }),
        description: 'The next Standard Project you play costs 8 M€ less.',
      },
    });
  }

  private matchingTypes(types: Array<CardType>): boolean {
    
    let StandardProjectDiscount = false;
    for (const typ of types) {
      if (typ === CardType.STANDARD_PROJECT) StandardProjectDiscount = true;
    }
    return StandardProjectDiscount;
  }

  // TODO(kberg): it's not possible to make this a cardDiscount type, which just means rendering is tricky.
  public override getCardDiscount(player: Player, card:IProjectCard) {
    if (player.lastCardPlayed === this.name && this.matchingTypes([card.type])) {
      return 8;
    } else {
      return 0;
    }
  }
}
