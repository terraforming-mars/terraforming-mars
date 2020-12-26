import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';
import {Game} from '../../Game';
import {StandardProjectCard} from './StandardProjectCard';
import {Resources} from '../../Resources';

export class PowerPlantStandard extends StandardProjectCard {
  public name = CardName.STANDARD_POWER_PLANT;
  public cost = 11;

  public canAct(player: Player, game: Game): boolean {
    let cost = this.cost;
    if (player.corporationCard?.name === CardName.THORGATE) {
      cost -= 3;
    }
    return player.canAfford(cost, game);
  }

  actionEssence(player: Player): void {
    if (player.corporationCard?.name === CardName.THORGATE) {
      player.megaCredits += 3;
    }
    player.addProduction(Resources.ENERGY);
  }

  public metadata: CardMetadata = {
    cardNumber: '',
    renderData: CardRenderer.builder((b) =>
      b.effectBox((eb) => {
        eb.megacredits(11).startAction.productionBox((pb) => {
          pb.energy(1);
        });
        eb.description('Action: Spend 11 MC to increase your Energy production 1 step.');
      }),
    ),
  };
}
