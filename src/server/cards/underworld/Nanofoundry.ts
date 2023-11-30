import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Tag} from '../../../common/cards/Tag';
import {digit, played} from '../Options';

export class Nanofoundry extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.NANOFOUNDRY,
      type: CardType.AUTOMATED,
      cost: 18,
      tags: [Tag.POWER, Tag.SCIENCE],
      victoryPoints: 2,

      requirements: {tag: Tag.SCIENCE, count: 2},

      behavior: {
        production: {energy: -5},
        drawCard: {count: {tag: Tag.POWER}},
      },

      metadata: {
        cardNumber: 'U74',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.energy(-5, {digit})).cards(1).slash().energy(1, {played});
        }),
        description: 'Requires 2 science tags. Reduce your energy production 5 steps. ' +
          'Draw 1 card for every power tag you have, including this.',
      },
    });
  }
}
