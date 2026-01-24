import {PreludeCard} from '../prelude/PreludeCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';

export class InvestorPlaza extends PreludeCard {
  constructor() {
    super({
      name: CardName.INVESTOR_PLAZA,
      tags: [Tag.EARTH, Tag.CITY],

      behavior: {
        city: {},
        underworld: {corruption: 1},
      },

      metadata: {
        cardNumber: 'UP02',
        renderData: CardRenderer.builder((b) => {
          b.city().corruption();
        }),
        description: 'Place a city and gain 1 corruption.',
      },
    });
  }
}

