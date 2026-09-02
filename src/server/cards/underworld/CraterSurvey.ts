import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Tag} from '../../../common/cards/Tag';
import {digit} from '../Options';

export class CraterSurvey extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.CRATER_SURVEY,
      type: CardType.EVENT,
      cost: 5,
      tags: [Tag.SCIENCE],

      behavior: {
        underworld: {identify: {count: 4, claim: 1}},
      },

      metadata: {
        cardNumber: 'U069',
        renderData: CardRenderer.builder((b) => {
          b.identify(4, {digit}).claim(1);
        }),
        description: 'Identify 4 underground resources. Claim one of them.',
      },
    });
  }
}
