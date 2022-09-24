import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../CardRequirements';
import {Card} from '../Card';

export class SpacePort extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 22,
      tags: [Tag.CITY, Tag.BUILDING],
      name: CardName.SPACE_PORT,
      cardType: CardType.AUTOMATED,

      behavior: {
        production: {energy: -1, megacredits: 4},
        colonies: {addTradeFleet: 1},
        city: {},
      },

      requirements: CardRequirements.builder((b) => b.colonies()),
      metadata: {
        cardNumber: 'C39',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().energy(1).br;
            pb.plus().megacredits(4);
          }).nbsp.city().br;
          b.tradeFleet();
        }),
        description: 'Requires 1 colony. Decrease your energy production 1 step and increase your M€ production 4 steps. Place a City tile. Gain 1 Trade Fleet.',
      },
    });
  }
}
