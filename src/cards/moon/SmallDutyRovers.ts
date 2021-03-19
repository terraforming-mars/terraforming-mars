import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardRenderer} from '../render/CardRenderer';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {SpaceType} from '../../SpaceType';
import {Resources} from '../../Resources';
import {Units} from '../../Units';
import {MoonCard} from './MoonCard';
import {TileType} from '../../TileType';

export class SmallDutyRovers extends MoonCard implements IProjectCard {
  constructor() {
    super({
      name: CardName.SMALL_DUTY_ROVERS,
      cardType: CardType.AUTOMATED,
      tags: [Tags.MOON, Tags.SPACE],
      cost: 9,
      productionBox: Units.of({}),

      metadata: {
        description: 'Spend 1 titanium. Raise the Logistic Rate 1 step. Gain 1 MC per colony tile, mine tile and road tile on the Moon.',
        cardNumber: 'M73',
        renderData: CardRenderer.builder((b) => {
          b.minus().titanium(1).moonLogisticsRate().br;
          b.megacredits(1).slash()
            .tile(TileType.MOON_COLONY, false)
            .tile(TileType.MOON_MINE, false)
            .tile(TileType.MOON_ROAD, false).br;
        }),
      },
    }, {
      reserveUnits: Units.of({titanium: 1}),
    });
  };

  public play(player: Player) {
    Units.deductUnits(this.reserveUnits, player);
    MoonExpansion.raiseLogisticRate(player);
    const moonData = MoonExpansion.moonData(player.game);
    const gain = moonData.moon.spaces.filter((s) => s.tile !== undefined && s.spaceType !== SpaceType.COLONY).length;

    player.setResource(Resources.MEGACREDITS, gain, player.game);

    return undefined;
  }
}
