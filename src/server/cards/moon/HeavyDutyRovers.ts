import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {TileType} from '../../../common/TileType';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {Card} from '../Card';
import {Resource} from '../../../common/Resource';
import {all} from '../Options';

export class HeavyDutyRovers extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.HEAVY_DUTY_ROVERS,
      cost: 12,

      behavior: {
        moon: {logisticsRate: 1},
      },

      metadata: {
        description: 'Gain 4 M€ for each mining tile adjacent to a road tile. Raise the logistic rate 1 step.',
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

  public override bespokePlay(player: Player) {
    MoonExpansion.ifMoon(player.game, (moonData) => {
      const mines = MoonExpansion.spaces(player.game, TileType.MOON_MINE);
      const minesNextToRoads = mines.filter((mine) => {
        const spacesNextToMine = moonData.moon.getAdjacentSpaces(mine);
        const firstRoad = spacesNextToMine.find((s) => MoonExpansion.spaceHasType(s, TileType.MOON_ROAD));
        return firstRoad !== undefined;
      });
      const count = minesNextToRoads.length;
      player.addResource(Resource.MEGACREDITS, count * 4, {log: true});
    });
    return undefined;
  }
}
