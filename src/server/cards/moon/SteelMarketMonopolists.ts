import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {CardRenderer} from '../render/CardRenderer';
import {Resource} from '../../../common/Resource';
import {MarketCard} from './MarketCard';
import {multiplier} from '../Options';

export class SteelMarketMonopolists extends MarketCard {
  constructor() {
    super(
      Resource.STEEL,
      {from: 3, to: 2, limit: 3},
      {from: 1, to: 3, limit: 3},
      {
        name: CardName.STEEL_MARKET_MONOPOLISTS,
        type: CardType.ACTIVE,
        cost: 15,
        requirements: {miningRate: 3},

        metadata: {
          description: 'Requires the mining rate to be 3 or higher.',
          cardNumber: 'M28',
          renderData: CardRenderer.builder((b) => {
            b.action('Spend 3X M€ to gain 2X steel (max 9 M€)', (eb) => {
              eb.megacredits(3, {multiplier}).startAction.text('x').steel(2).asterix();
            }).br;
            b.or().br;
            b.action('Spend X steel to gain 3X M€ (max 3 steel).', (eb) => {
              eb.text('X').steel(1).startAction.text('x').megacredits(3).asterix();
            });
          }),
        },
      });
  }
}
