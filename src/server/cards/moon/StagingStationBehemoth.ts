import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class StagingStationBehemoth extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.STAGING_STATION_BEHEMOTH,
      cardType: CardType.AUTOMATED,
      tags: [Tag.SPACE],
      cost: 24,

      behavior: {
        moon: {logisticsRate: 1},
        colonies: {addTradeFleet: 2},
      },

      metadata: {
        description: 'Gain 2 trade fleets. Raise the Logistic Rate 1 step.',
        cardNumber: 'M68',
        renderData: CardRenderer.builder((b) => {
          b.tradeFleet().tradeFleet().moonLogisticsRate();
        }),
      },
    });
  }
}
