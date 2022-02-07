import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {Resources} from '../../common/Resources';
import {CardName} from '../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class SolarWindPower extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.SOLAR_WIND_POWER,
      tags: [Tags.SCIENCE, Tags.SPACE, Tags.ENERGY],
      cost: 11,

      metadata: {
        cardNumber: '077',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.energy(1)).br.titanium(2);
        }),
        description: 'Increase your energy production 1 step and gain 2 titanium.',
      },
    });
  }
  public play(player: Player) {
    player.addProduction(Resources.ENERGY, 1);
    player.titanium += 2;
    return undefined;
  }
}
