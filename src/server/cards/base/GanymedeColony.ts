import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {SpaceName} from '../../../common/boards/SpaceName';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class GanymedeColony extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.GANYMEDE_COLONY,
      tags: [Tag.JOVIAN, Tag.SPACE, Tag.CITY],
      cost: 20,

      victoryPoints: {tag: Tag.JOVIAN},
      behavior: {
        city: {space: SpaceName.GANYMEDE_COLONY},
      },

      metadata: {
        description: 'Place a city tile ON THE RESERVED AREA.',
        cardNumber: '081',
        renderData: CardRenderer.builder((b) => {
          b.city().asterix().br;
          b.vpText('1 VP per Jovian tag you have.');
        }),
      },
    });
  }
}
