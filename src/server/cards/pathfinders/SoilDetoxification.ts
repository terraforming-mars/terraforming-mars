import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {PartyName} from '../../../common/turmoil/PartyName';

export class SoilDetoxification extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.SOIL_DETOXIFICATION,
      cost: 10,
      tags: [Tag.PLANT, Tag.SCIENCE],

      requirements: {party: PartyName.GREENS},

      behavior: {
        production: {plants: 1},
        greeneryDiscount: 1,
      },

      metadata: {
        cardNumber: 'PfTmp',
        renderData: CardRenderer.builder((b) => {
          b.effect('Using the STANDARD GREENERY ACTION costs 1 plant less.', (eb) => eb.greenery().asterix().startEffect.minus().plants(1)).br;
          b.production((pb) => pb.plants(1));
        }),
        description: 'Requires that Greens are ruling or you have 2 delegates there. Increase your plant production 1 step',
      },
    });
  }
}
