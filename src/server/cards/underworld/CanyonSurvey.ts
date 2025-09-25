import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Tag} from '../../../common/cards/Tag';
import {digit} from '../Options';

export class CanyonSurvey extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.CANYON_SURVEY,
      type: CardType.EVENT,
      cost: 4,
      tags: [Tag.SCIENCE],

      behavior: {
        underworld: {identify: {count: 3, claim: 1}},
      },

      metadata: {
        cardNumber: 'U081',
        renderData: CardRenderer.builder((b) => {
          b.identify(3, {digit}).claim(1);
        }),
        description: 'Identify 3 underground resources. Claim 1 of them.',
      },
    });
  }
}
