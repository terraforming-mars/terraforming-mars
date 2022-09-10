import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {IProjectCard} from '../IProjectCard';

export class MiningQuota extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.MINING_QUOTA,
      cardType: CardType.AUTOMATED,
      tags: [Tag.BUILDING],
      cost: 5,

      behavior: {
        production: {steel: 2},
      },

      requirements: CardRequirements.builder((b) => b.tag(Tag.VENUS).tag(Tag.EARTH).tag(Tag.JOVIAN)),
      metadata: {
        cardNumber: '239',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.steel(2));
        }),
        description: 'Requires Venus, Earth and Jovian tags. Increase your steel production 2 steps.',
      },
    });
  }
}
