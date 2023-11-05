import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {IProjectCard} from '../IProjectCard';
import {CardResource} from '../../../common/CardResource';
import {CardType} from '../../../common/cards/CardType';
import {ActionCard} from '../ActionCard';

export class PrivateMilitaryContractor extends ActionCard implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.PRIVATE_MILITARY_CONTRACTOR,
      cost: 18,
      tags: [Tag.JOVIAN, Tag.SPACE],
      resourceType: CardResource.FIGHTER,

      behavior: {
        addResources: 1,
      },

      action: {
        spend: {titanium: 1},
        addResources: 1,
      },

      metadata: {
        cardNumber: 'U49',
        renderData: CardRenderer.builder((b) => {
          b.effect(
            'When blocking damage from other players, you can use fighters here as if they were corruption ' +
            'resources. You cannot use them for score bribing or collusion.',
            (eb) => eb.corruptionShield().startEffect.fighter().equals().corruption().asterix()).br;
          b.action('Spend 1 titanium to gain 1 fighter resource on this card.',
            (ab) => ab.titanium(1).startAction.fighter(1)).br;
          b.fighter();
        }),
        description: 'Put 1 fighter resource on this card.',
      },
    });
  }
}

