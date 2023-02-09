import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class AsteroidMining extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.ASTEROID_MINING,
      tags: [Tag.JOVIAN, Tag.SPACE],
      cost: 30,
      victoryPoints: 2,

      behavior: {
        production: {titanium: 2},
      },

      metadata: {
        description: 'Increase your titanium production 2 steps.',
        cardNumber: '040',
        renderData: CardRenderer.builder((b) => b.production((pb) => pb.titanium(2))),
      },
    });
  }
}
