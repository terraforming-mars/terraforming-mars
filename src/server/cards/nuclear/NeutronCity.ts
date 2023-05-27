import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class NeutrondCity extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.NEUTRON_CITY,
      tags: [Tag.CITY, Tag.BUILDING],
      cost: 23,
      victoryPoints: 2,
      
      behavior: {
        production: {energy: -2, steel: 1, megacredits: 3},
        city: {},
      },

      metadata: {
        cardNumber: 'N05',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().energy(2).br;
            pb.plus().megacredits(3).steel(1);
          }).nbsp.city();
        }),
        description: 'Decrease your energy production 2 steps. Increase your M€ production 3 steps and your steel production 1 step. Place a city tile',
      },
    });
  }
}
