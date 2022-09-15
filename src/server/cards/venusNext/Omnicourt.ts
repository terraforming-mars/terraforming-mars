import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {IProjectCard} from '../IProjectCard';

export class Omnicourt extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.OMNICOURT,
      cardType: CardType.AUTOMATED,
      tags: [Tag.BUILDING],
      cost: 11,

      behavior: {
        tr: 2,
      },

      requirements: CardRequirements.builder((b) => b.tag(Tag.VENUS).tag(Tag.EARTH).tag(Tag.JOVIAN)),
      metadata: {
        cardNumber: '241',
        renderData: CardRenderer.builder((b) => {
          b.tr(2);
        }),
        description: 'Requires Venus, Earth and Jovian tags. Increase your TR 2 steps.',
      },
    });
  }
}
