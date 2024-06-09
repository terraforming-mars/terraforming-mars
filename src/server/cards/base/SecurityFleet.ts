import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {ActionCard} from '../ActionCard';
import {CardType} from '../../../common/cards/CardType';
import {CardResource} from '../../../common/CardResource';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class SecurityFleet extends ActionCard implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.SECURITY_FLEET,
      tags: [Tag.SPACE],
      cost: 12,
      resourceType: CardResource.FIGHTER,

      victoryPoints: {resourcesHere: {}},

      action: {
        spend: {titanium: 1},
        addResources: 1,
      },

      metadata: {
        cardNumber: '028',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 1 titanium to add 1 fighter resource to this card.', (eb) => {
            eb.titanium(1).startAction.resource(CardResource.FIGHTER);
          }).br;
          b.vpText('1 VP for each fighter resource on this card.');
        }),
      },
    });
  }
}
