import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {ActionCard} from '../ActionCard';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class SpaceElevator extends ActionCard implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.SPACE_ELEVATOR,
      tags: [Tag.SPACE, Tag.BUILDING],
      cost: 27,

      behavior: {
        production: {titanium: 1},
      },
      action: {
        spend: {steel: 1},
        stock: {megacredits: 5},
      },

      victoryPoints: 2,

      metadata: {
        cardNumber: '013',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 1 steel to gain 5 M€.', (eb) => {
            eb.steel(1).startAction.megacredits(5);
          }).br;
          b.production((pb) => pb.titanium(1));
        }),
        description: 'Increase your titanium production 1 step.',
      },
    });
  }
}
