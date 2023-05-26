import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {played} from '../Options';

export class CentralDockingStation extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.CENTRAL_DOCKING_STATION,
      tags: [Tag.CITY, Tag.SPACE, Tag.BUILDING],
      cost: 20,

      behavior: {
        production: {megacredits: {tag: Tag.CITY}},
        city: {},
      },

      metadata: {
        cardNumber: 'N50',
        description: 'Increase your M€ production for each City tag you have, including this. Place a City tile.',
        renderData: CardRenderer.builder((b) => {   
          b.production((pb) => pb.megacredits(1).slash().city({size: Size.MEDIUM, played})).br;
          b.city();
        }),
      },
    });
  }
}
