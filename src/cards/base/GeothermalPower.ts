import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';

export class GeothermalPower extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.GEOTHERMAL_POWER,
      tags: [Tags.ENERGY, Tags.BUILDING],
      cost: 11,

      metadata: {
        cardNumber: '117',
        renderData: CardRenderer.builder((b) => b.production((pb) => pb.energy(2))),
        description: 'Increase your energy production 2 steps.',
      },
    });
  }
  public play(player: Player) {
    player.addProduction(Resources.ENERGY, 2);
    return undefined;
  }
}
