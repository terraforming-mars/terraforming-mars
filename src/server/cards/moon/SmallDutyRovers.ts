import {CardName} from '../../../common/cards/CardName';
import {IPlayer} from '../../IPlayer';
import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {SpaceType} from '../../../common/boards/SpaceType';
import {Resource} from '../../../common/Resource';
import {Size} from '../../../common/cards/render/Size';
import {TileType} from '../../../common/TileType';
import {all} from '../Options';
import {Card} from '../Card';

export class SmallDutyRovers extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.SMALL_DUTY_ROVERS,
      type: CardType.AUTOMATED,
      tags: [Tag.MOON, Tag.SPACE],
      cost: 9,
      reserveUnits: {titanium: 1},

      behavior: {
        moon: {logisticsRate: 1},
      },

      metadata: {
        description: 'Spend 1 titanium. Raise the logistic rate 1 step. Gain 1 M€ per habitat tile, mine tile and road tile on The Moon.',
        cardNumber: 'M73',
        renderData: CardRenderer.builder((b) => {
          b.minus().titanium(1).moonLogisticsRate().br;
          b.megacredits(1).slash()
            .moonHabitat({size: Size.SMALL, all})
            .moonMine({size: Size.SMALL, all})
            .moonRoad({size: Size.SMALL, all});
        }),
      },
    });
  }

  public override bespokePlay(player: IPlayer) {
    const moonData = MoonExpansion.moonData(player.game);
    let gain = moonData.moon.spaces.filter((s) => s.tile !== undefined && s.spaceType !== SpaceType.COLONY).length;
    if (moonData.moon.spaces.some((s) => s.tile?.tileType === TileType.LUNAR_MINE_URBANIZATION)) {
      gain++;
    }
    player.stock.add(Resource.MEGACREDITS, gain, {log: true});

    return undefined;
  }
}
