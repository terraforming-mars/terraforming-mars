import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class SpaceHotels extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.SPACE_HOTELS,
      tags: [Tag.SPACE, Tag.EARTH],
      cost: 12,

      behavior: {
        production: {megacredits: 4},
      },

      requirements: CardRequirements.builder((b) => b.tag(Tag.EARTH, 2)),
      metadata: {
        cardNumber: 'P42',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.megacredits(4);
          });
        }),
        description: 'Requires 2 Earth tags. Increase M€ production 4 steps.',
      },
    });
  }
}
