import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {all} from '../Options';

export class Asteroid extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.ASTEROID,
      tags: [Tag.SPACE],
      cost: 14,

      behavior: {
        stock: {titanium: 2},
        global: {temperature: 1},
        removeAnyPlants: 3,
      },

      metadata: {
        description: 'Raise temperature 1 step and gain 2 titanium. Remove up to 3 plants from any player.',
        cardNumber: '009',
        renderData: CardRenderer.builder((b) => {
          b.temperature(1).br;
          b.titanium(2).br;
          b.minus().plants(-3, {all});
        }),
      },
    });
  }
}
