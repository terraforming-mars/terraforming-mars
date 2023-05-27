import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {CardResource} from '../../../common/CardResource';

export class NitrateCombustion extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.NITRATE_COMBUSTION,
      cost: 16,
      tags: [Tag.SCIENCE, Tag.POWER],

      behavior: {
        global: {temperature: 1},
        production: {energy: 2},
        addResourcesToAnyCard: {count: 2, type: CardResource.MICROBE},
      },

      metadata: {
        cardNumber: 'N41',
        renderData: CardRenderer.builder((b) => {
          b.temperature(1).production((pb) => pb.energy(2)).microbes(2).asterix();
        }),
        description: 'Increase temperature 2 steps. Increase your energy production 1 step. Add 2 microbes to ANOTHER card. ',
      },
    });
  }
}
