import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class ImportOfAdvancedGHG extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.IMPORT_OF_ADVANCED_GHG,
      tags: [Tag.EARTH, Tag.SPACE],
      cost: 9,

      behavior: {
        production: {heat: 2},
      },

      metadata: {
        cardNumber: '167',
        renderData: CardRenderer.builder((b) => b.production((pb) => pb.heat(2))),
        description: 'Increase your heat production 2 steps.',
      },
    });
  }
}
