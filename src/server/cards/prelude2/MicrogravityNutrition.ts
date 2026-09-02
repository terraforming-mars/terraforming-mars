import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {Size} from '../../../common/cards/render/Size';
import {Card} from '../Card';
import {CardRenderer} from '../render/CardRenderer';

export class MicrogravityNutrition extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 11,
      tags: [Tag.MICROBE, Tag.PLANT],
      name: CardName.MICROGRAVITY_NUTRITION,
      type: CardType.AUTOMATED,
      victoryPoints: 1,

      behavior: {
        production: {megacredits: {colonies: {}}},
      },

      metadata: {
        description: 'Increase your M€ production 1 step for each colony you have.',
        cardNumber: 'P79',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(1).slash().colonies(1, {size: Size.SMALL})).br;
        }),
      },
    });
  }
}
