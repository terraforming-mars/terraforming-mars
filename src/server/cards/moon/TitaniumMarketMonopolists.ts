import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {CardRenderer} from '../render/CardRenderer';
import {Resource} from '../../../common/Resource';
import {MarketCard} from './MarketCard';

export class TitaniumMarketMonopolists extends MarketCard {
  constructor() {
    super(
      Resource.TITANIUM,
      {from: 2, to: 1, limit: 4},
      {from: 1, to: 4, limit: 4},
      {
        name: CardName.TITANIUM_MARKET_MONOPOLISTS,
        type: CardType.ACTIVE,
        cost: 21,

        requirements: {miningRate: 3},
        metadata: {
          description: 'Requires the mining rate to be 3 or higher.',
          cardNumber: 'M29',
          renderData: CardRenderer.builder((b) => {
            b.megacredits(1, {text: '2x'}).arrow().text('X').titanium(1).asterix().nbsp.or().br;
            b.text('X').titanium(1).arrow().text('X').megacredits(4).asterix().br;

            b.plainText('Action: Spend 2X M€ to gain X titanium [max 8 M€], or spend X titanium to gain 4X M€ [max 4 titanium].', /* parens */ true);
          }),
        },
      });
  }
}
