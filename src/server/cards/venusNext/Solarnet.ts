import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {IProjectCard} from '../IProjectCard';

export class Solarnet extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.SOLARNET,
      cardType: CardType.AUTOMATED,
      cost: 7,

      requirements: CardRequirements.builder((b) => b.tag(Tag.VENUS).tag(Tag.EARTH).tag(Tag.JOVIAN)),
      victoryPoints: 1,

      behavior: {
        drawCard: 2,
      },

      metadata: {
        cardNumber: '245',
        renderData: CardRenderer.builder((b) => {
          b.cards(2);
        }),
        description: 'Requires Venus, Earth and Jovian tags. Draw 2 cards.',
      },
    });
  }
}
