import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {SpaceName} from '../../../common/boards/SpaceName';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class CeresSpaceport extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.CERES_SPACEPORT,
      tags: [Tag.JOVIAN, Tag.JOVIAN, Tag.CITY, Tag.SPACE],
      cost: 36,
      victoryPoints: 1,

      behavior: {
        drawCard: 1,
        ocean: {},
        city: {space: SpaceName.CERES_SPACEPORT},
        production: {megacredits: 2, titanium: {tag: Tag.JOVIAN, per: 2}},
      },

      metadata: {
        cardNumber: 'Pf14',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(2))
            .production((pb) => pb.titanium(1).slash().tag(Tag.JOVIAN, 2))
            .br
            .cards(1).oceans(1).city().asterix().br;
        }),
        description: 'Increase your M€ production 2 steps, and titanium production 1 step for every 2 Jovian tags (including these.) ' +
          'Draw a card. Place an ocean tile. Place a city tile ON THE RESERVED AREA.',
      },
    });
  }
}
