import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {SpaceName} from '../../SpaceName';
import {SpaceType} from '../../../common/boards/SpaceType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {played} from '../Options';

export class LunarEmbassy extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.LUNAR_EMBASSY,
      tags: [Tag.EARTH, Tag.MARS, Tag.CITY, Tag.SPACE],
      cost: 28,
      victoryPoints: 2,

      behavior: {
        drawCard: 1,
        city: {space: SpaceName.LUNAR_EMBASSY, type: SpaceType.COLONY},
        production: {megacredits: 3, plants: {tag: Tag.EARTH, per: 2}},
      },

      metadata: {
        cardNumber: 'Pf16',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(3))
            .production((pb) => pb.plants(1).slash().earth(2, {played}))
            .br
            .cards(1).city().asterix().br;
        }),
        description: 'Increase your M€ production 3 steps, and plant production 1 step for every 2 earth tags (including this.) ' +
          'Draw a card. Place a city tile ON THE RESERVED AREA.',
      },
    });
  }
}
