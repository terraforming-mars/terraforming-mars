import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {IProjectCard} from '../IProjectCard';
import {CardResource} from '../../../common/CardResource';
import {CardType} from '../../../common/cards/CardType';
import {ActionCard} from '../ActionCard';

export class RobotMoles extends ActionCard implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.ROBOT_MOLES,
      cost: 6,
      tags: [Tag.MARS],
      victoryPoints: {resourcesHere: {}, per: 3},
      resourceType: CardResource.DATA,

      action: {
        spend: {steel: 1},
        addResources: 1,
        underworld: {identify: 2},
      },

      metadata: {
        cardNumber: 'U45',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 1 steel to add 1 data to this card and identify 2 underground resources.',
            (ab) => ab.steel(1).startAction.resource(CardResource.DATA).identify(2));
        }),
        description: '1 VP per 3 data resources on this card.',
      },
    });
  }
}

