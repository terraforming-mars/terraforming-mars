import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {CardRequirements} from '../CardRequirements';
import {Size} from '../../../common/cards/render/Size';

export class LuxuryEstate extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.LUXURY_ESTATE,
      cost: 12,
      tags: [Tag.EARTH, Tag.MARS, Tag.BUILDING],
      requirements: CardRequirements.builder((b) => b.oxygen(7)),

      behavior: {
        stock: {titanium: {cities: {}, greeneries: {}, all: false}},
      },

      metadata: {
        cardNumber: 'Pf21',
        renderData: CardRenderer.builder((b) => {
          b.titanium(1).slash().city().plus().greenery(Size.MEDIUM, false);
        }),
        description: 'Oxygen must be 7% or greater. Gain 1 titanium for each city tile and greenery tile you own.',
      },
    });
  }
}

