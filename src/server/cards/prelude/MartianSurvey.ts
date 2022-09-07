import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {Card} from '../Card';
import {CardName} from '../../../common/cards/CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {max} from '../Options';

export class MartianSurvey extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.MARTIAN_SURVEY,
      tags: [Tag.SCIENCE],
      cost: 9,
      victoryPoints: 1,

      behavior: {
        drawCard: 2,
      },

      requirements: CardRequirements.builder((b) => b.oxygen(4, {max})),
      metadata: {
        cardNumber: 'P38',
        renderData: CardRenderer.builder((b) => {
          b.cards(2);
        }),
        description: 'Oxygen must be 4% or lower. Draw two cards.',
      },
    });
  }
}
