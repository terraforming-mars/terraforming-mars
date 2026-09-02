import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {all} from '../Options';

export class MediaArchives extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.MEDIA_ARCHIVES,
      tags: [Tag.EARTH],
      cost: 8,

      behavior: {
        stock: {megacredits: {eventsPlayed: true, all: true}},
      },

      metadata: {
        cardNumber: '107',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(1).slash().tag(Tag.EVENT, {all});
        }),
        description: 'Gain 1 M€ for each event EVER PLAYED by all players.',
      },
    });
  }
}
