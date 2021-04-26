import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../Units';

export class PowerPlant extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.POWER_PLANT,
      tags: [Tags.ENERGY, Tags.BUILDING],
      cost: 4,
      productionBox: Units.of({energy: 1}),

      metadata: {
        cardNumber: '141',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.energy(1));
        }),
        description: 'Increase your Energy production 1 step.',
      },
    });
  }

  public play(player: Player) {
    player.addProduction(Resources.ENERGY, 1);
    return undefined;
  }
}

