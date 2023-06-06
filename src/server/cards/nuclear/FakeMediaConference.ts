import { Card } from '../Card';
import { CardType } from '../../../common/cards/CardType';
import { IProjectCard } from '../IProjectCard';
import { CardName } from '../../../common/cards/CardName';
import { CardRenderer } from '../render/CardRenderer';
import { Size } from '../../../common/cards/render/Size';
import { Tag } from '../../../common/cards/Tag';
//import { Player } from '../../Player';

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

}
