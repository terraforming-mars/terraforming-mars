import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {max} from '../Options';

export class ArchaeBacteria extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.ARCHAEBACTERIA,
      tags: [Tag.MICROBE],
      cost: 6,

      behavior: {
        production: {plants: 1},
      },

      requirements: CardRequirements.builder((b) => b.temperature(-18, {max})),
      metadata: {
        description: 'It must be -18 C or colder. Increase your plant production 1 step.',
        cardNumber: '042',
        renderData: CardRenderer.builder((b) => b.production((pb) => pb.plants(1))),
      },
    });
  }
}
