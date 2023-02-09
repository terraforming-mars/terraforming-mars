import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {PartyName} from '../../../common/turmoil/PartyName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class WildlifeDome extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.WILDLIFE_DOME,
      cost: 15,
      tags: [Tag.ANIMAL, Tag.PLANT, Tag.BUILDING],
      cardType: CardType.AUTOMATED,
      requirements: CardRequirements.builder((b) => b.party(PartyName.GREENS)),

      behavior: {
        greenery: {},
      },

      metadata: {
        cardNumber: 'T15',
        renderData: CardRenderer.builder((b) => {
          b.greenery();
        }),
        description: 'Requires that Greens are ruling or that you have 2 delegates there. Place a greenery tile and raise oxygen 1 step.',
      },
    });
  }
}
