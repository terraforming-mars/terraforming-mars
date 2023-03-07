import {IProjectCard} from '../IProjectCard';
import {ActionCard} from '../ActionCard';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {VictoryPoints} from '../ICard';

export class CultivationOfVenus extends ActionCard implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.CULTIVATION_OF_VENUS,
      cost: 18,
      tags: [Tag.PLANT, Tag.VENUS],
      victoryPoints: VictoryPoints.tags(Tag.VENUS, 1, 2),

      action: {
        spend: {plants: 3},
        global: {venus: 1},
      },

      metadata: {
        cardNumber: 'Pf45',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 3 plants to raise Venus 1 step.', (eb) => {
            eb.plants(3).startAction.venus(1);
          }).br;
        }),
        description: '1 VP for every 2 Venus tags you own.',
      },
    });
  }
}

