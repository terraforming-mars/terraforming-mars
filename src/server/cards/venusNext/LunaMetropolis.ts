import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {SpaceName} from '../../SpaceName';
import {SpaceType} from '../../../common/boards/SpaceType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {played} from '../Options';
import {IProjectCard} from '../IProjectCard';

export class LunaMetropolis extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.LUNA_METROPOLIS,
      cardType: CardType.AUTOMATED,
      tags: [Tag.CITY, Tag.SPACE, Tag.EARTH],
      cost: 21,

      victoryPoints: 2,
      behavior: {
        production: {megacredits: {tag: Tag.EARTH}},
        city: {space: SpaceName.LUNA_METROPOLIS, type: SpaceType.COLONY},
      },

      metadata: {
        cardNumber: '236',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(1).slash().earth(1, {played})).br;
          b.city().asterix();
        }),
        description: 'Increase your M€ production 1 step for each Earth tag you have, including this. Place a City tile on the RESERVED AREA',
      },
    });
  }
}
