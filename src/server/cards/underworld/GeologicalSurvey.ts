import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Tag} from '../../../common/cards/Tag';
import {digit} from '../Options';
import {CardResource} from '../../../common/CardResource';

export class GeologicalSurvey extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.GEOLOGICAL_SURVEY_UNDERWORLD,
      type: CardType.EVENT,
      cost: 2,
      tags: [Tag.MARS, Tag.SCIENCE],

      behavior: {
        addResourcesToAnyCard: {count: 1, type: CardResource.DATA},
        underworld: {identify: 2},
      },

      metadata: {
        cardNumber: 'U81',
        renderData: CardRenderer.builder((b) => {
          b.resource(CardResource.DATA).asterix().identify(2, {digit});
        }),
        description: 'Add 1 data resource to ANOTHER card. Identify any 2 underground resources on Mars.',
      },
    });
  }
}
