import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';

export class PowerPlant extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.POWER_PLANT,
      tags: [Tags.ENERGY, Tags.BUILDING],
      cost: 4,

      metadata: {
        cardNumber: '141',
        renderData: CardRenderer.builder((b) => {
          b.productionBox((pb) => pb.energy(1));
        }),
        description: 'Increase your Energy production 1 step.',
      },
    });
  }

  public play(player: Player) {
    player.addProduction(Resources.ENERGY);
    return undefined;
  }
}

