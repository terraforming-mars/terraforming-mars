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
        cardNumber: 'P47',
        renderData: CardRenderer.builder((b) => {
          b.effect('Each time you become party leader, draw 1 card.', (ab) => {
            ab.partyLeaders(1).startEffect.cards(1);
          }).br;
          b.tr(1).megacredits(4).br;
          b.plainText('Raise your TR 1 step and gain 4 M€');
        }),
      },
    });

    // Behavior in Party.ts
  }
}

