import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';

export class SolarPower extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.SOLAR_POWER,
      tags: [Tags.ENERGY, Tags.BUILDING],
      cost: 11,

      metadata: {
        cardNumber: '113',
        renderData: CardRenderer.builder((b) => {
          b.productionBox((pb) => pb.energy(1));
        }),
        description: 'Increase your energy production 1 step.',
        victoryPoints: 1,
      },
    });
  }
  public play(player: Player) {
    player.addProduction(Resources.ENERGY);
    return undefined;
  }
  public getVictoryPoints() {
    return 1;
  }
}
