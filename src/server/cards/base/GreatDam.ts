import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class GreatDam extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.GREAT_DAM,
      tags: [Tag.POWER, Tag.BUILDING],
      cost: 12,

      behavior: {
        production: {energy: 2},
      },
      victoryPoints: 1,

      requirements: {oceans: 4},
      metadata: {
        cardNumber: '136',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.energy(2));
        }),
        description: 'Requires 4 ocean tiles. Increase your energy production 2 steps.',
      },
    });
  }
}

