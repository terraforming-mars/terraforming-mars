import {CardName} from '../../common/cards/CardName';
import {Player} from '../../Player';
import {CardType} from '../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {CardRenderer} from '../render/CardRenderer';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {Card} from '../Card';

export class StagingStationBehemoth extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.STAGING_STATION_BEHEMOTH,
      cardType: CardType.AUTOMATED,
      tags: [Tags.SPACE],
      cost: 24,
      tr: {moonLogistics: 1},

      metadata: {
        description: 'Gain 2 trade fleets. Raise the Logistic Rate 1 step.',
        cardNumber: 'M68',
        renderData: CardRenderer.builder((b) => {
          b.tradeFleet().tradeFleet().moonLogisticsRate();
        }),
      },
    });
  }

  public play(player: Player) {
    player.increaseFleetSize();
    player.increaseFleetSize();
    MoonExpansion.raiseLogisticRate(player);
    return undefined;
  }
}
