import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {PartyName} from '../../../common/turmoil/PartyName';
import {CardRenderer} from '../render/CardRenderer';

export class EventAnalysts extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.EVENT_ANALYSTS,
      tags: [Tag.SCIENCE],
      cost: 5,

      behavior: {
        turmoil: {influenceBonus: 1},
      },

      requirements: {party: PartyName.SCIENTISTS},
      metadata: {
        description: 'Requires that Scientists are ruling or that you have 2 delegates there.',
        cardNumber: 'T05',
        renderData: CardRenderer.builder((b) => b.effect('You have +1 influence.', (be) => {
          be.startEffect.influence();
        })),
      },
    });
  }
}
