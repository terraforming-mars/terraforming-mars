import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {PreludeCard} from '../prelude/PreludeCard';

export class CorridorsOfPower extends PreludeCard {
  constructor() {
    super({
      name: CardName.CORRIDORS_OF_POWER,
      tags: [Tag.EARTH],

      behavior: {
        tr: 1,
        stock: {megacredits: 4},
      },

      metadata: {
        cardNumber: '',
        renderData: CardRenderer.builder((b) => {
          b.effect('Whenever one of your delegates becomes a Party Leader, draw a card', (ab) => {
            ab.partyLeaders(1).startEffect.cards(1);
          }).br;
          b.tr(1).megacredits(4).br;
          b.plainText('Increase your TR one step. Gain 4 M€');
        }),
      },
    });

    // Behavior in Party.ts
  }
}

