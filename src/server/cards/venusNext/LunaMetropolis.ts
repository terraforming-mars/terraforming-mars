import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {SpaceName} from '../../../common/boards/SpaceName';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {IProjectCard} from '../IProjectCard';

export class LunaMetropolis extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.LUNA_METROPOLIS,
      type: CardType.AUTOMATED,
      tags: [Tag.CITY, Tag.SPACE, Tag.EARTH],
      cost: 21,

      victoryPoints: 2,
      behavior: {
        production: {megacredits: {tag: Tag.EARTH}},
        city: {space: SpaceName.LUNA_METROPOLIS},
      },

      metadata: {
        cardNumber: '236',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(1).slash().tag(Tag.EARTH)).br;
          b.city().asterix();
        }),
        description: 'Increase your M€ production 1 step for each Earth tag you have, including this. Place a city tile on the RESERVED AREA.',
      },
    });
  }
}
