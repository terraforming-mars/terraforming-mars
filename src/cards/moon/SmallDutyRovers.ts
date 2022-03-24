import {CardName} from '../../common/cards/CardName';
import {Player} from '../../Player';
import {CardType} from '../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {CardRenderer} from '../render/CardRenderer';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {SpaceType} from '../../common/boards/SpaceType';
import {Resources} from '../../common/Resources';
import {Units} from '../../common/Units';
import {Size} from '../../common/cards/render/Size';
import {Card} from '../Card';
import {all} from '../Options';

export class SmallDutyRovers extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.SMALL_DUTY_ROVERS,
      cardType: CardType.AUTOMATED,
      tags: [Tags.MOON, Tags.SPACE],
      cost: 9,
      reserveUnits: Units.of({titanium: 1}),
      tr: {moonLogistics: 1},

      metadata: {
        description: 'Spend 1 titanium. Raise the Logistic Rate 1 step. Gain 1 M€ per colony tile, mine tile and road tile on the Moon.',
        cardNumber: 'M73',
        renderData: CardRenderer.builder((b) => {
          b.minus().titanium(1).moonLogisticsRate().br;
          b.megacredits(1).slash()
            .moonColony({size: Size.SMALL, all})
            .moonMine({size: Size.SMALL, all})
            .moonRoad({size: Size.SMALL, all});
        }),
      },
    });
  }

  public play(player: Player) {
    player.deductUnits(this.reserveUnits);
    MoonExpansion.raiseLogisticRate(player);
    const moonData = MoonExpansion.moonData(player.game);
    const gain = moonData.moon.spaces.filter((s) => s.tile !== undefined && s.spaceType !== SpaceType.COLONY).length;

    player.addResource(Resources.MEGACREDITS, gain, {log: true});

    return undefined;
  }
}
