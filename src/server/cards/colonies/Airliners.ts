import {IProjectCard} from '../IProjectCard';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardResource} from '../../../common/CardResource';
import {Card} from '../Card';
import {CardRenderer} from '../render/CardRenderer';

export class Airliners extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 11,
      name: CardName.AIRLINERS,
      type: CardType.AUTOMATED,
      requirements: {floaters: 3},
      victoryPoints: 1,

      behavior: {
        production: {megacredits: 2},
        addResourcesToAnyCard: {count: 2, type: CardResource.FLOATER},
      },

      metadata: {
        cardNumber: 'C01',
        description: 'Requires that you have 3 floaters. Increase your M€ production 2 steps. Add 2 floaters to ANY card.',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(2)).br;
          b.resource(CardResource.FLOATER, 2).asterix();
        }),
      },
    });
  }
}
