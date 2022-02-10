import {CardName} from '../../common/cards/CardName';
import {CardType} from '../../common/cards/CardType';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Resources} from '../../common/Resources';
import {MarketCard} from './MarketCard';
import {multiplier} from '../Options';

export class TitaniumMarketMonopolists extends MarketCard {
  constructor() {
    super(
      Resources.TITANIUM,
      {from: 2, to: 1, limit: 4},
      {from: 1, to: 4, limit: 4},
      {
        name: CardName.TITANIUM_MARKET_MONOPOLISTS,
        cardType: CardType.ACTIVE,
        cost: 21,

        requirements: CardRequirements.builder((b) => b.miningRate(3)),
        metadata: {
          description: 'Requires Mining Rate to be 3 or higher.',
          cardNumber: 'M29',
          renderData: CardRenderer.builder((b) => {
            b.action('Spend 2X M€ to gain X titanium [max 8 M€]', (eb) => {
              eb.megacredits(2, {multiplier}).startAction.text('X').titanium(1).asterix();
            }).br;
            b.or().br;
            b.action('Spend X titanium to gain 4X M€ [max 4 titanium].', (eb) => {
              eb.text('X').titanium(1).startAction.text('X').megacredits(4).asterix();
            });
          }),
        },
      });
  }
}
