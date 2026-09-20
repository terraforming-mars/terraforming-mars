import {IActionCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {ActionCard} from '../ActionCard';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class WaterImportFromEuropa extends ActionCard implements IActionCard, IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.WATER_IMPORT_FROM_EUROPA,
      tags: [Tag.JOVIAN, Tag.SPACE],
      cost: 25,

      victoryPoints: {tag: Tag.JOVIAN},

      action: {
        spend: {megacredits: 12, canUseTitanium: true},
        ocean: {},
      },

      metadata: {
        cardNumber: '012',
        renderData: CardRenderer.builder((b) => {
          b.action('Pay 12 M€ to place an ocean tile. TITANIUM MAY BE USED as if playing a space card.', (eb) => {
            eb.megacredits(12).super((b) => b.titanium(1)).startAction.oceans(1);
          }).br;
          b.vpText('1 VP for each Jovian tag you have.');
        }),
      },
    });
  }
}
