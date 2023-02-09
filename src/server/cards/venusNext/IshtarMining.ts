import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {IProjectCard} from '../IProjectCard';

export class IshtarMining extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.ISHTAR_MINING,
      cardType: CardType.AUTOMATED,
      tags: [Tag.VENUS],
      cost: 5,

      behavior: {
        production: {titanium: 1},
      },

      requirements: CardRequirements.builder((b) => b.venus(8)),
      metadata: {
        cardNumber: '233',
        renderData: CardRenderer.builder((b) => b.production((pb) => pb.titanium(1))),
        description: 'Requires Venus 8%. Increase your titanium production 1 step.',
      },
    });
  }
}
