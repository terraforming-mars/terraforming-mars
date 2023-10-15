import {ICorporationCard} from '../corporation/ICorporationCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';

export class Incite extends Card implements ICorporationCard {
  constructor() {
    super({
      name: CardName.INCITE,
      tags: [Tag.SCIENCE],
      startingMegaCredits: 32,
      type: CardType.CORPORATION,

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
