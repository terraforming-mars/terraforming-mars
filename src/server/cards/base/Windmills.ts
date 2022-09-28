import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class Windmills extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.WINDMILLS,
      tags: [Tag.ENERGY, Tag.BUILDING],
      cost: 6,

      behavior: {
        production: {energy: 1},
      },
      victoryPoints: 1,

      requirements: CardRequirements.builder((b) => b.oxygen(7)),
      metadata: {
        cardNumber: '168',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.energy(1));
        }),
        description: 'Requires 7% oxygen. Increase your energy production 1 step.',
      },
    });
  }
}
