import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class VestaShipyard extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.VESTA_SHIPYARD,
      tags: [Tag.JOVIAN, Tag.SPACE],
      cost: 15,
      victoryPoints: 1,

      behavior: {
        production: {titanium: 1},
      },

      metadata: {
        cardNumber: '057',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.titanium(1));
        }),
        description: 'Increase your titanium production 1 step.',
      },
    });
  }
}
