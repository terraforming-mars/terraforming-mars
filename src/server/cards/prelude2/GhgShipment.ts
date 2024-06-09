import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CardType} from '../../../common/cards/CardType';
import {Card} from '../Card';
import {PartyName} from '../../../common/turmoil/PartyName';
import {CardResource} from '../../../common/CardResource';

export class GhgShipment extends Card {
  constructor() {
    super({
      name: CardName.GHG_SHIPMENT,
      type: CardType.EVENT,
      tags: [Tag.SPACE],
      cost: 3,

      behavior: {
        production: {heat: 1},
        stock: {heat: {floaters: {}}},
      },

      requirements: {party: PartyName.KELVINISTS},

      metadata: {
        cardNumber: '',
        description: 'Requires that Kelvinists are in power or that you have 2 delegates there. ' +
         'Increase your heat production 1 step. Gain 1 heat for each floater you have.',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.heat(1)).br;
          b.heat(1).slash().resource(CardResource.FLOATER);
        }),
      },
    });
  }
}
