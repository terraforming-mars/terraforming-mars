import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {PartyName} from '../../../common/turmoil/PartyName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class SponsoredMohole extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 5,
      tags: [Tag.BUILDING],
      name: CardName.SPONSORED_MOHOLE,
      cardType: CardType.AUTOMATED,

      behavior: {
        production: {heat: 2},
      },

      requirements: CardRequirements.builder((b) => b.party(PartyName.KELVINISTS)),
      metadata: {
        cardNumber: 'T13',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.heat(2));
        }),
        description: 'Requires that Kelvinists are ruling or that you have 2 delegates there. Increase your heat production 2 steps.',
      },
    });
  }
}
