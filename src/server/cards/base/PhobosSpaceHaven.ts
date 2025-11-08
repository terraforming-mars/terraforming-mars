import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {SpaceName} from '../../../common/boards/SpaceName';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class PhobosSpaceHaven extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.PHOBOS_SPACE_HAVEN,
      tags: [Tag.SPACE, Tag.CITY],
      cost: 25,
      victoryPoints: 3,

      behavior: {
        production: {titanium: 1},
        city: {space: SpaceName.PHOBOS_SPACE_HAVEN},
      },

      metadata: {
        cardNumber: '021',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.titanium(1)).nbsp.city().asterix();
        }),
        description: 'Increase your titanium production 1 step and place a city tile ON THE RESERVED AREA.',
      },
    });
  }
}
