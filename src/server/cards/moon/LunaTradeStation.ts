import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {MoonSpaces} from '../../../common/moon/MoonSpaces';
import {TileType} from '../../../common/TileType';
import {CardRenderer} from '../render/CardRenderer';
import {IActionCard} from '../ICard';
import {ActionCard} from '../ActionCard';
import {all} from '../Options';

export class LunaTradeStation extends ActionCard implements IActionCard {
  constructor() {
    super({
      name: CardName.LUNA_TRADE_STATION,
      type: CardType.ACTIVE,
      tags: [Tag.MOON, Tag.MOON, Tag.SPACE],
      cost: 10,
      reserveUnits: {titanium: 2},

      action: {
        stock: {megacredits: {moon: {habitat: {}}, each: 2}},
      },

      behavior: {
        moon: {
          tile: {
            type: TileType.LUNA_TRADE_STATION,
            space: MoonSpaces.LUNA_TRADE_STATION,
          },
        },
      },

      metadata: {
        description: 'Spend 2 titanium. Place this tile ON THE RESERVED AREA.',
        cardNumber: 'M13',
        renderData: CardRenderer.builder((b) => {
          b.action('Gain 2 M€ for each habitat tile on The Moon.', (eb) =>
            eb.empty().startAction.megacredits(2).slash().moonHabitat({all}));
          b.br.minus().titanium(2).tile(TileType.LUNA_TRADE_STATION, true).asterix();
        }),
      },
    });
  }
}
