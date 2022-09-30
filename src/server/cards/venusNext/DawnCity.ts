import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {SpaceName} from '../../SpaceName';
import {SpaceType} from '../../../common/boards/SpaceType';
import {CardName} from '../../../common/cards/CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {IProjectCard} from '../IProjectCard';

export class DawnCity extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.DAWN_CITY,
      cardType: CardType.AUTOMATED,
      tags: [Tag.CITY, Tag.SPACE],
      cost: 15,

      requirements: CardRequirements.builder((b) => b.tag(Tag.SCIENCE, 4)),
      victoryPoints: 3,
      behavior: {
        production: {energy: -1, titanium: 1},
        city: {space: SpaceName.DAWN_CITY, type: SpaceType.COLONY},
      },

      metadata: {
        cardNumber: '220',
        description: 'Requires 4 science tags. Decrease your energy production 1 step. Increase your titanium production 1 step. Place a City tile on the RESERVED AREA.',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().energy(1).br;
            pb.plus().titanium(1);
          }).nbsp.city().asterix();
        }),
      },
    });
  }
}
