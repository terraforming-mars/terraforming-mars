import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {all} from '../Options';

export class GiantIceAsteroid extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.GIANT_ICE_ASTEROID,
      tags: [Tag.SPACE],
      cost: 36,

      behavior: {
        global: {temperature: 2},
        removeAnyPlants: 6,
        ocean: {count: 2},
      },

      metadata: {
        description: 'Raise temperature 2 steps and place 2 ocean tiles. Remove up to 6 plants from any player.',
        cardNumber: '080',
        renderData: CardRenderer.builder((b) => {
          b.temperature(2).br;
          b.oceans(2).br;
          b.minus().plants(-6, {all});
        }),
      },
    });
  }
}
