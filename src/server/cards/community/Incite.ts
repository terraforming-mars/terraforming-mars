import {CorporationCard} from '../corporation/CorporationCard';
import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {ICorporationCard} from '../corporation/ICorporationCard';

export class Incite extends CorporationCard implements ICorporationCard {
  constructor() {
    super({
      name: CardName.INCITE,
      tags: [Tag.SCIENCE],
      startingMegaCredits: 32,

      behavior: {
        turmoil: {influenceBonus: 1},
      },
      firstAction: {
        text: 'Place 2 delegates in one party',
        turmoil: {sendDelegates: {count: 2}},
      },

      metadata: {
        cardNumber: 'R37',
        description: 'You start with 32 M€. As your first action, place two delegates in one party.',
        renderData: CardRenderer.builder((b) => {
          b.br.br;
          b.megacredits(32).nbsp.delegates(2);
          b.corpBox('effect', (ce) => {
            ce.vSpace(Size.LARGE);
            ce.effect(undefined, (eb) => {
              eb.empty().startEffect.influence();
            });
            ce.vSpace(Size.SMALL);
            ce.effect('You have +1 influence. When you send a delegate using the lobbying action, you pay 2 M€ less for it.', (eb) => {
              eb.delegates(1).startEffect.megacredits(-2);
            });
          });
        }),
      },
    });
  }
}
