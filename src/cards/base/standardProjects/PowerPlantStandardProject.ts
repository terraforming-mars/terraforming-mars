import {Player} from '../../../Player';
import {CardName} from '../../../CardName';
import {CardRenderer} from '../../render/CardRenderer';
import {StandardProjectCard} from '../../StandardProjectCard';
import {Resources} from '../../../Resources';

export class PowerPlantStandardProject extends StandardProjectCard {
  constructor() {
    super({
      name: CardName.POWER_PLANT_STANDARD_PROJECT,
      cost: 11,
      metadata: {
        cardNumber: 'SP7',
        renderData: CardRenderer.builder((b) =>
          b.standardProject('Spend 11 M€ to increase your Energy production 1 step.', (eb) => {
            eb.megacredits(11).startAction.production((pb) => {
              pb.energy(1);
            });
          }),
        ),
      },
    });
  }

  protected discount(player: Player): number {
    let discount = 0;
    if (player.isCorporation(CardName.THORGATE)) {
      discount += 3;
    }
    if (player.playedCards.some((card) => card.name === CardName.HIGH_TEMP_SUPERCONDUCTORS)) {
      discount += 3;
    }
    return discount;
  }

  actionEssence(player: Player): void {
    player.addProduction(Resources.ENERGY, 1);
  }
}
