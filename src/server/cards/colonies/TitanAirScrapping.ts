import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardResource} from '../../../common/CardResource';
import {CardRenderer} from '../render/CardRenderer';
import {ActionCard} from '../ActionCard';

export class TitanAirScrapping extends ActionCard implements IProjectCard {
  constructor() {
    super({
      cost: 21,
      tags: [Tag.JOVIAN],
      name: CardName.TITAN_AIRSCRAPPING,
      type: CardType.ACTIVE,
      resourceType: CardResource.FLOATER,
      victoryPoints: 2,

      action: {
        or: {
          autoSelect: true,
          behaviors: [
            {
              spend: {resourcesHere: 2},
              tr: 1,
              title: 'Remove 2 floaters here to increase your TR 1 step',
            },
            {
              spend: {titanium: 1},
              addResources: 2,
              title: 'Spend 1 titanium to add 2 floaters here',
            },
          ],
        },
      },

      metadata: {
        cardNumber: 'C43',
        renderData: CardRenderer.builder((b) => {
          b.titanium(1).arrow().resource(CardResource.FLOATER, 2).nbsp.or().br;
          b.resource(CardResource.FLOATER, 2).arrow().tr(1).br;

          b.plainText('Action: Spend 1 titanium to add 2 floaters here, or spend 2 floaters here to increase your TR 1 step.', /* parens */ true);
        }),
      },
    });
  }
}
