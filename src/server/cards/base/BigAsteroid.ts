import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {all} from '../Options';

export class BigAsteroid extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.BIG_ASTEROID,
      tags: [Tag.SPACE],
      cost: 27,

      behavior: {
        stock: {titanium: 4},
        global: {temperature: 2},
        removeAnyPlants: 4,
      },

      metadata: {
        description: 'Raise temperature 2 steps and gain 4 titanium. Remove up to 4 plants from any player.',
        cardNumber: '011',
        renderData: CardRenderer.builder((b) => {
          b.temperature(2).br;
          b.titanium(4).br;
          b.minus().plants(-4, {all});
        }),
      },
    });
  }
}
