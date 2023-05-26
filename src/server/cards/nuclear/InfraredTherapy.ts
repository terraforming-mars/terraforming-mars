import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {digit} from '../Options';
import {CardRequirements} from '../requirements/CardRequirements';
import {Resource} from '../../../common/Resource';

export class InfraredTherapy extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.INFRARED_THERAPY,
      cost: 15,
      requirements: CardRequirements.builder((b) => b.production(Resource.HEAT, 2)),
      reserveUnits: {steel: 1, titanium: 2},

      behavior: {
        stock: {heat: 4},
        tr: 2,
      },

      metadata: {
        cardNumber: 'N67',
        renderData: CardRenderer.builder((b) => {
          b.minus().steel(1, {digit});
          b.minus().titanium(2, {digit}).br;
          b.plus().heat(4, {digit});
          b.tr(2);
        }),
        description: 'Requires 2 heat production. Spend 1 steel and 2 titanium. Gain 4 heat, and raise your TR 2 steps.',
      },
    });
  }
}