import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {Resources} from '../../common/Resources';
import {CardName} from '../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../common/Units';

export class GeothermalPower extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.GEOTHERMAL_POWER,
      tags: [Tags.ENERGY, Tags.BUILDING],
      cost: 11,
      productionBox: Units.of({energy: 2}),

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
