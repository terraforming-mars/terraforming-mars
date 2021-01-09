import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';
import {StandardProjectCard} from './StandardProjectCard';
import {Resources} from '../../Resources';

export class PowerPlantStandard extends StandardProjectCard {
  public name = CardName.STANDARD_POWER_PLANT;
  public cost = 11;

  protected discount(player: Player): number {
    if (player.isCorporation(CardName.THORGATE)) {
      return 3;
    }
    return super.discount(player);
  }

  actionEssence(player: Player): void {
    player.addProduction(Resources.ENERGY);
  }

  public metadata: CardMetadata = {
    cardNumber: 'SP7',
    renderData: CardRenderer.builder((b) =>
      b.standardProject('Spend 11 MC to increase your Energy production 1 step.', (eb) => {
        eb.megacredits(11).startAction.production((pb) => {
          pb.energy(1);
        });
      }),
    ),
  };
}
