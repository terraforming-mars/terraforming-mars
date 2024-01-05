import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class CutThroatBudgeting extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.CUT_THROAT_BUDGETING,
      type: CardType.EVENT,
      cost: 2,
      victoryPoints: -2,

      requirements: {corruption: 1},
      behavior: {
        production: {megacredits: 1, steel: 1, energy: 1},
      },

      metadata: {
        cardNumber: 'U80',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(1).steel(1).energy(1));
        }),
        description: 'Requires 1 corruption. Increase your M€, steel, and energy production 1 step each.',
      },
    });
  }
}
