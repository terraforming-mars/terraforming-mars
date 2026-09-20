import {IProjectCard} from '../IProjectCard';
import {CardType} from '../../../common/cards/CardType';
import {CardResource} from '../../../common/CardResource';
import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {ActionCard} from '../ActionCard';

export class CometAiming extends ActionCard implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.COMET_AIMING,
      tags: [Tag.SPACE],
      cost: 17,
      resourceType: CardResource.ASTEROID,

      action: {
        or: {
          autoSelect: true,
          behaviors: [
            {
              spend: {resourcesHere: 1},
              ocean: {},
              title: 'Remove 1 asteroid here to place an ocean',
            },
            {
              spend: {titanium: 1},
              addResourcesToAnyCard: {type: CardResource.ASTEROID, count: 1, mustHaveCard: true},
              title: 'Spend 1 titanium to add 1 asteroid to any card',
            },
          ],
        },
      },

      metadata: {
        cardNumber: 'X16',
        renderData: CardRenderer.builder((b) => {
          b.titanium(1).arrow().resource(CardResource.ASTEROID).asterix().nbsp.or().br;
          b.resource(CardResource.ASTEROID).arrow().oceans(1).br;

          b.plainText('Action: Spend 1 titanium to add 1 asteroid resource to ANY CARD, or remove 1 asteroid here to place an ocean.', /* parens */ true);
        }),
      },
    });
  }
}
