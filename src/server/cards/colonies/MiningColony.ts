import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {Card} from '../Card';
import {CardRenderer} from '../render/CardRenderer';

export class MiningColony extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 20,
      tags: [Tag.SPACE],
      name: CardName.MINING_COLONY,
      cardType: CardType.AUTOMATED,

      behavior: {
        production: {titanium: 1},
        colonies: {buildColony: {}},
      },

      metadata: {
        cardNumber: 'C25',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.titanium(1)).colonies(1);
        }),
        description: 'Increase your titanium production 1 step. Place a colony.',
      },
    });
  }
}
