import {IProjectCard} from '@/server/cards/IProjectCard';
import {Card} from '@/server/cards/Card';
import {CardName} from '@/common/cards/CardName';
import {CardType} from '@/common/cards/CardType';
import {Tag} from '@/common/cards/Tag';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {all} from '@/server/cards/Options';

export class SmallAsteroid extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.SMALL_ASTEROID,
      tags: [Tag.SPACE],
      cost: 10,

      behavior: {
        global: {temperature: 1},
        removeAnyPlants: 2,
      },

      metadata: {
        cardNumber: '209',
        renderData: CardRenderer.builder((b) => {
          b.temperature(1).br;
          b.minus().plants(2, {all});
        }),
        description: 'Increase temperature 1 step. Remove up to 2 plants from any player.',
      },
    });
  }
}
