import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class WavePower extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.WAVE_POWER,
      tags: [Tags.ENERGY],
      cost: 8,

      requirements: CardRequirements.builder((b) => b.oceans(3)),
      metadata: {
        cardNumber: '139',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.energy(1));
        }),
        description: 'Requires 3 ocean tiles. Increase your energy production 1 step.',
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

