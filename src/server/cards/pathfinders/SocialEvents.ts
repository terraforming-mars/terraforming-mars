import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {played} from '../Options';

export class SocialEvents extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.SOCIAL_EVENTS,
      cost: 18,
      tags: [Tag.EARTH, Tag.MARS],

      behavior: {
        tr: {tag: Tag.MARS, per: 2},
      },

      metadata: {
        cardNumber: '...',
        renderData: CardRenderer.builder((b) => {
          b.tr(1).slash().mars(2, {played});
        }),
        description: 'Gain 1 TR for every 2 Mars tags you have (including this one.)',
      },
    });
  }
}
