import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {CardMetadata} from '../CardMetadata';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {TileType} from '../../TileType';
import {CardRenderer} from '../render/CardRenderer';

export class HeavyDutyRovers implements IProjectCard {
  public cost = 12;
  public tags = [];
  public cardType = CardType.AUTOMATED;
  public name = CardName.HEAVY_DUTY_ROVERS;

  public play(player: Player) {
    MoonExpansion.ifMoon(player.game, (moonData) => {
      const mines = moonData.moon.getSpacesWithTile(TileType.MOON_MINE);
      const minesNextToRoads = mines.filter((mine) => {
        const spacesNextToMine = moonData.moon.getAdjacentSpaces(mine);
        const firstRoad = spacesNextToMine.find((space) => space.tile?.tileType === TileType.MOON_ROAD);
        return firstRoad !== undefined;
      });
      const count = minesNextToRoads.length;
      player.megaCredits += count * 4;
      MoonExpansion.raiseLogisticRate(player);
    });
    return undefined;
  }

  public readonly metadata: CardMetadata = {
    description: 'Gain 4 MC for each mining tile adjacent to a road tile. Raise the Logistic Rate 1 step.',
    cardNumber: 'M39',
    renderData: CardRenderer.builder((b) => {
      // TODO(kberg): Can the two tiles abut each other?
      b.megacredits(4).slash().tile(TileType.MOON_MINE, false).tile(TileType.MOON_ROAD, false);
      b.br;
      b.moonLogisticsRate();
    }),
  };
}
