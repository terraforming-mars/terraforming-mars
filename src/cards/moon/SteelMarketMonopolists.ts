import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../CardRequirements';
import {Resources} from '../../Resources';
import {MarketCard} from './MarketCard';

export class SteelMarketMonopolists extends MarketCard {
  constructor() {
    super(
      Resources.STEEL,
      {from: 3, to: 2, limit: 6},
      {from: 1, to: 3, limit: 3},
      {
        name: CardName.STEEL_MARKET_MONOPOLISTS,
        cardType: CardType.ACTIVE,
        cost: 15,

        metadata: {
          description: 'Requires Mining Rate to be 3 or higher.',
          cardNumber: 'M28',
          requirements: CardRequirements.builder((b) => b.miningRate(3)),
          renderData: CardRenderer.builder((b) => {
            b.action('Spend 3X MC to gain 2X steel (max 9MC)', (eb) => {
              eb.megacredits(3).multiplier.startAction.text('x').steel(2).asterix();
            }).br;
            b.or().br;
            b.action('Spend X steel to gain 3X MC (max 3 steel).', (eb) => {
              eb.text('X').steel(0).startAction.text('x').megacredits(3).asterix();
            });
          }),
        },
      });
  }
}
