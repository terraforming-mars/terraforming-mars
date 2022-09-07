
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class CallistoPenalMines extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.CALLISTO_PENAL_MINES,
      tags: [Tag.JOVIAN, Tag.SPACE],
      cost: 24,
      victoryPoints: 2,

      behavior: {
        production: {megacredits: 3},
      },

      metadata: {
        description: 'Increase your M€ production 3 steps.',
        cardNumber: '082',
        renderData: CardRenderer.builder((b) => b.production((pb) => {
          pb.megacredits(3);
        })),
      },
    });
  }
}
