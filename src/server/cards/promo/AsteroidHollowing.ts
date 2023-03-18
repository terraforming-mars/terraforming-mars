import {IProjectCard} from '../IProjectCard';
import {ActionCard} from '../ActionCard';
import {VictoryPoints} from '../ICard';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {CardResource} from '../../../common/CardResource';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';

export class AsteroidHollowing extends ActionCard implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.ASTEROID_HOLLOWING,
      tags: [Tag.SPACE],
      cost: 16,
      resourceType: CardResource.ASTEROID,

      action: {
        spend: {titanium: 1},
        production: {megacredits: 1},
        addResources: 1,
      },

      victoryPoints: VictoryPoints.resource(1, 2),

      metadata: {
        cardNumber: 'X15',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 1 titanium to add 1 asteroid resource here and increase M€ production 1 step.', (eb) => {
            eb.titanium(1).startAction.asteroids(1).production((pb) => pb.megacredits(1));
          }).br;
          b.vpText('1VP for each 2 asteroids on this card.');
        }),
      },
    });
  }
}
