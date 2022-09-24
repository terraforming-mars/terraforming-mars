
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {digit, max} from '../Options';

export class DomedCrater extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.DOMED_CRATER,
      tags: [Tag.CITY, Tag.BUILDING],
      cost: 24,
      victoryPoints: 1,

      behavior: {
        production: {energy: -1, megacredits: 3},
        stock: {plants: 3},
        city: {},
      },

      requirements: CardRequirements.builder((b) => b.oxygen(7, {max})),
      metadata: {
        cardNumber: 'T03',
        description: {
          text: 'Oxygen must be 7% or less. Gain 3 plants. Place a City tile. Decrease your energy production 1 step and increase your M€ production 3 steps.',
          align: 'left',
        },
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().energy(1).br;
            pb.plus().megacredits(3);
          }).nbsp.city().plants(3, {digit}).br;
        }),
      },
    });
  }
}
