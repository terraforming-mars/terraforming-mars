import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tags} from '../Tags';
import {Units} from '../../Units';

export class PowerPlant extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.POWER_PLANT_PATHFINDERS,
      cost: 13,
      tags: [Tags.MARS, Tags.ENERGY, Tags.BUILDING],
      productionBox: Units.of({heat: 2, energy: 1}),

      metadata: {
        cardNumber: 'Pf20',
        renderData: CardRenderer.builder((b) => {
          b.production(((pb) => pb.heat(2).energy(1)));
        }),
        description: 'Increase your heat production 2 steps and your energy production 1 step.',
      },
    });
  }

  public play(player: Player) {
    player.adjustProduction(this.productionBox);
    return undefined;
  }
}

