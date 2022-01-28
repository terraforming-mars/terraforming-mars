import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {StandardProjectCard} from '../StandardProjectCard';
import {ColonyName} from '../../colonies/ColonyName';
import {BuildColony} from '../../deferredActions/BuildColony';
import {MAX_COLONIES_PER_TILE} from '../../constants';

export class BuildColonyStandardProject extends StandardProjectCard {
  constructor() {
    super({
      name: CardName.BUILD_COLONY_STANDARD_PROJECT,
      cost: 17,
      metadata: {
        cardNumber: 'SP5',
        renderData: CardRenderer.builder((b) =>
          b.standardProject('Spend 17 M€ to place a colony.', (eb) => {
            eb.megacredits(17).startAction.colonies();
          }),
        ),
      },
    });
  }

  private getOpenColonies(player: Player) {
    let openColonies = player.game.colonies.filter((colony) =>
      colony.colonies.length < MAX_COLONIES_PER_TILE &&
      colony.colonies.includes(player.id) === false &&
      colony.isActive);

    // TODO: Europa sometimes costs additional 3.
    const canAffordVenus = player.canAfford(this.cost, {tr: {venus: 1}});
    if (!canAffordVenus) {
      openColonies = openColonies.filter((colony) => colony.name !== ColonyName.VENUS);
    }

    return openColonies;
  }

  public override canAct(player: Player): boolean {
    return super.canAct(player) && this.getOpenColonies(player).length > 0;
  }

  actionEssence(player: Player): void {
    player.game.defer(new BuildColony(player, false, 'Select colony'));
  }
}
