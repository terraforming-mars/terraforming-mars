import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {Card} from '../Card';
import {CardRenderer} from '../render/CardRenderer';

export class EarthElevator extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 43,
      tags: [Tag.SPACE, Tag.EARTH],
      name: CardName.EARTH_ELEVATOR,
      cardType: CardType.AUTOMATED,
      victoryPoints: 4,

      behavior: {
        production: {titanium: 3},
      },

      metadata: {
        description: 'Increase your titanium production 3 steps.',
        cardNumber: 'C08',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.titanium(3));
        }),
      },
    });
  }
}
