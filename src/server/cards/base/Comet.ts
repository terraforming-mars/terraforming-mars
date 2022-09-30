import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {all} from '../Options';

export class Comet extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.COMET,
      tags: [Tag.SPACE],
      cost: 21,

      behavior: {
        global: {temperature: 1},
        ocean: {},
        removeAnyPlants: 3,
      },

      metadata: {
        cardNumber: '010',
        description: 'Raise temperature 1 step and place an ocean tile. Remove up to 3 plants from any player.',
        renderData: CardRenderer.builder((b) => {
          b.temperature(1).oceans(1).br;
          b.minus().plants(-3, {all});
        }),
      },
    });
  }
}
