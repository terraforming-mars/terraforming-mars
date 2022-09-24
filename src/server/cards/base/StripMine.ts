import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class StripMine extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.STRIP_MINE,
      tags: [Tag.BUILDING],
      cost: 25,

      behavior: {
        production: {energy: -2, steel: 2, titanium: 1},
        global: {oxygen: 2},
      },

      metadata: {
        cardNumber: '138',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().energy(2).br;
            pb.plus().steel(2).titanium(1);
          }).br;
          b.oxygen(2);
        }),
        description: 'Decrease your energy production 2 steps. Increase your steel production 2 steps and your titanium production 1 step. Raise oxygen 2 steps.',
      },
    });
  }
}
