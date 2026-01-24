import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {ActionCard} from '../ActionCard';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {PartyName} from '../../../common/turmoil/PartyName';
import {CardRenderer} from '../render/CardRenderer';

export class MartianMediaCenter extends ActionCard implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.MARTIAN_MEDIA_CENTER,
      tags: [Tag.BUILDING],
      cost: 7,

      behavior: {
        production: {megacredits: 2},
      },

      action: {
        spend: {megacredits: 3},
        turmoil: {sendDelegates: {count: 1}},
      },

      requirements: {party: PartyName.MARS},
      metadata: {
        cardNumber: 'T07',
        renderData: CardRenderer.builder((b) => {
          b.action('Pay 3 M€ to add a delegate to any party.', (eb) => {
            eb.megacredits(3).startAction.delegates(1);
          }).br;
          b.production((pb) => {
            pb.megacredits(2);
          });
        }),
        description: 'Requires that Mars First is ruling or that you have 2 delegates there. Increase your M€ production 2 steps.',
      },
    });
  }
}
