import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class SolarWindPower extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.SOLAR_WIND_POWER,
      tags: [Tag.SCIENCE, Tag.SPACE, Tag.ENERGY],
      cost: 11,
      productionBox: {energy: 1},

      metadata: {
        cardNumber: '077',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.energy(1)).br.titanium(2);
        }),
        description: 'Increase your energy production 1 step and gain 2 titanium.',
      },
    });
  }
  public override bespokePlay(player: Player) {
    player.titanium += 2;
    return undefined;
  }
}
