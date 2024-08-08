import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {CardRenderer} from '../render/CardRenderer';

export class ColonialRepresentation extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.COLONIAL_REPRESENTATION,
      cost: 10,

      behavior: {
        turmoil: {influenceBonus: 1},
        stock: {
          megacredits: {
            colonies: {colonies: {}},
            each: 3,
          },
        },
      },

      metadata: {
        cardNumber: 'P71',
        renderData: CardRenderer.builder((b) => {
          b.effect('You have +1 influence.', (eb) => {
            eb.startEffect.influence();
          }).br;
          b.megacredits(3).slash().colonies();
        }),
        description: 'Gain 3 M€ per colony you have.',
      },
    });
  }
}
