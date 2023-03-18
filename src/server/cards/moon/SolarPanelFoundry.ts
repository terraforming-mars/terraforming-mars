import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {ActionCard} from '../ActionCard';

export class SolarPanelFoundry extends ActionCard implements IProjectCard {
  constructor() {
    super({
      name: CardName.SOLAR_PANEL_FOUNDRY,
      type: CardType.ACTIVE,
      tags: [Tag.POWER, Tag.MOON, Tag.BUILDING],
      cost: 11,

      action: {
        spend: {steel: 2},
        production: {energy: 1},
      },

      metadata: {
        cardNumber: 'M89',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 2 steel to increase your energy production 1 step.',
            (eb) => eb.startAction.steel(2).arrow().production((pb) => pb.energy(1)));
        }),
      },
    });
  }
}
