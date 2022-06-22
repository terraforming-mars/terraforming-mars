import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {Resources} from '../../common/Resources';
import {CardName} from '../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../common/Units';

export class SolarPower extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.SOLAR_POWER,
      tags: [Tags.ENERGY, Tags.BUILDING],
      cost: 11,
      productionBox: Units.of({energy: 1}),
      victoryPoints: 1,

      metadata: {
        cardNumber: '113',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.energy(1));
        }),
        description: 'Increase your energy production 1 step.',
      },
    });
  }
  public play(player: Player) {
    player.addProduction(Resources.ENERGY, 1);
    return undefined;
  }
}
