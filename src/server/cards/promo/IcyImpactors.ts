import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {CardRenderer} from '../render/CardRenderer';
import {ActionCard} from '../ActionCard';
import {IActionCard} from '../ICard';
import {Tag} from '../../../common/cards/Tag';
import {CardResource} from '../../../common/CardResource';

export class IcyImpactors extends ActionCard implements IActionCard {
  constructor() {
    super({
      name: CardName.ICY_IMPACTORS,
      type: CardType.ACTIVE,
      tags: [Tag.SPACE],
      cost: 15,
      resourceType: CardResource.ASTEROID,

      action: {
        or: {
          autoSelect: true,
          behaviors: [
            {
              title: 'Spend 1 asteroid here to place an ocean (first player chooses where to place it)',
              spend: {resourcesHere: 1},
              ocean: {firstPlayerPlaces: true},
            },
            {
              title: 'Spend 10 M€ to add 2 asteroids here',
              spend: {megacredits: 10, canUseTitanium: true},
              addResources: 2,
            },
          ],
        },
      },

      metadata: {
        cardNumber: 'X47',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(10).super((b) => b.titanium(1)).arrow().resource(CardResource.ASTEROID, 2).br;
          b.or().resource(CardResource.ASTEROID).arrow().oceans(1).asterix().br;

          b.plainText('Action: Spend 10 M€ (titanium may be used) to add 2 asteroids here, or spend 1 asteroid here to place an ocean tile. FIRST PLAYER CHOOSES WHERE YOU MUST PLACE IT.', /* parens */ true);
        }),
      },
    });
  }
}
