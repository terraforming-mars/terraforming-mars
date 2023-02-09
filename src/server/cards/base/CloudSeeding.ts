import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Resources} from '../../../common/Resources';
import {CardName} from '../../../common/cards/CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {all} from '../Options';

export class CloudSeeding extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.CLOUD_SEEDING,
      cost: 11,

      behavior: {
        production: {megacredits: -1, plants: 2},
        decreaseAnyProduction: {type: Resources.HEAT, count: 1},
      },

      requirements: CardRequirements.builder((b) => b.oceans(3)),
      metadata: {
        cardNumber: '004',
        description: 'Requires 3 ocean tiles. Decrease your M€ production 1 step and any heat production 1 step. Increase your plant production 2 steps.',
        renderData: CardRenderer.builder((b) => b.production((pb) => {
          pb.minus().megacredits(1).heat(1, {all}).br;
          pb.plus().plants(2);
        })),
      },
    });
  }
}
