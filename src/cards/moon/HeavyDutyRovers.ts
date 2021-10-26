import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {TileType} from '../../TileType';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../render/Size';
import {Card} from '../Card';
import {Resources} from '../../Resources';
import {all} from '../Options';

export class HeavyDutyRovers extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.HEAVY_DUTY_ROVERS,
      cost: 12,
      tr: {moonLogistics: 1},

      metadata: {
        description: 'Gain 4 M€ for each mining tile adjacent to a road tile. Raise the Logistic Rate 1 step.',
        cardNumber: 'M39',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(4).slash().moonRoad({size: Size.SMALL, all})
            .moonMine({size: Size.SMALL, all});
          b.br;
          b.moonLogisticsRate({size: Size.SMALL});
        }),
      },
    });
  }

  public play(player: Player) {
    MoonExpansion.ifMoon(player.game, (moonData) => {
      const mines = MoonExpansion.tiles(player.game, TileType.MOON_MINE);
      const minesNextToRoads = mines.filter((mine) => {
        const spacesNextToMine = moonData.moon.getAdjacentSpaces(mine);
        const firstRoad = spacesNextToMine.find((s) => MoonExpansion.spaceHasType(s, TileType.MOON_ROAD));
        return firstRoad !== undefined;
      });
      const count = minesNextToRoads.length;
      player.addResource(Resources.MEGACREDITS, count * 4, {log: true});
      MoonExpansion.raiseLogisticRate(player);
    });
    return undefined;
  }
}
