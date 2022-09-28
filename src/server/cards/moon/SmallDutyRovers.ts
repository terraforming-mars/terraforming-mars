import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {SpaceType} from '../../../common/boards/SpaceType';
import {Resources} from '../../../common/Resources';
import {Size} from '../../../common/cards/render/Size';
import {all} from '../Options';
import {Card} from '../Card';

export class SmallDutyRovers extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.SMALL_DUTY_ROVERS,
      cardType: CardType.AUTOMATED,
      tags: [Tag.MOON, Tag.SPACE],
      cost: 9,
      reserveUnits: {titanium: 1},

      behavior: {
        moon: {logisticsRate: 1},
      },

      metadata: {
        description: 'Spend 1 titanium. Raise the Logistic Rate 1 step. Gain 1 M€ per habitat tile, mine tile and road tile on The Moon.',
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

  public override bespokePlay(player: Player) {
    const moonData = MoonExpansion.moonData(player.game);
    const gain = moonData.moon.spaces.filter((s) => s.tile !== undefined && s.spaceType !== SpaceType.COLONY).length;

    player.addResource(Resources.MEGACREDITS, gain, {log: true});

    return undefined;
  }
}
