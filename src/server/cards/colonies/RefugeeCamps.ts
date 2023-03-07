import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardResource} from '../../../common/CardResource';
import {CardRenderer} from '../render/CardRenderer';
import {ActionCard} from '../ActionCard';
import {VictoryPoints} from '../ICard';

export class RefugeeCamps extends ActionCard implements IProjectCard {
  constructor() {
    super({
      cost: 10,
      tags: [Tag.EARTH],
      name: CardName.REFUGEE_CAMPS,
      cardType: CardType.ACTIVE,
      resourceType: CardResource.CAMP,
      victoryPoints: VictoryPoints.resource(1, 1),

      action: {
        production: {megacredits: -1},
        addResources: 1,
      },

      metadata: {
        cardNumber: 'C33',
        renderData: CardRenderer.builder((b) => {
          b.action('Decrease your M€ production 1 step to add a camp resource to this card.', (eb) => {
            eb.production((pb) => pb.megacredits(1));
            eb.startAction.camps();
          }).br;
          b.vpText('1 VP for each camp resource on this card.');
        }),
      },
    });
  }
}

