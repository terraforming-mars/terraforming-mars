import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {SpaceName} from '../../SpaceName';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class LunarEmbassy extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.LUNAR_EMBASSY,
      tags: [Tag.EARTH, Tag.MARS, Tag.CITY, Tag.SPACE],
      cost: 28,
      victoryPoints: 2,

      behavior: {
        drawCard: 1,
        city: {space: SpaceName.LUNAR_EMBASSY},
        production: {megacredits: 3, plants: {tag: Tag.EARTH, per: 2}},
      },

      metadata: {
        cardNumber: 'Pf16',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(3))
            .production((pb) => pb.plants(1).slash().tag(Tag.EARTH, 2))
            .br
            .cards(1).city().asterix().br;
        }),
        description: 'Increase your M€ production 3 steps, and plant production 1 step for every 2 Earth tags (including this.) ' +
          'Draw a card. Place a city tile ON THE RESERVED AREA.',
      },
    });
  }
}
