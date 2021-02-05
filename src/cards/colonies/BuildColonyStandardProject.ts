import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {StandardProjectCard} from '../StandardProjectCard';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import * as constants from '../../constants';
import {ColonyName} from '../../colonies/ColonyName';
import {BuildColony} from '../../deferredActions/BuildColony';

export class BuildColonyStandardProject extends StandardProjectCard {
  constructor() {
    super({
      name: CardName.BUILD_COLONY_STANDARD_PROJECT,
      cost: 17,
      metadata: {
        cardNumber: 'SP5',
        renderData: CardRenderer.builder((b) =>
          b.standardProject('Spend 17 MC to place a colony.', (eb) => {
            eb.megacredits(17).startAction.colonies();
          }),
        ),
      },
    });
  }

  private getOpenColonies(player: Player) {
    let openColonies = player.game.colonies.filter((colony) => colony.colonies.length < 3 &&
      colony.colonies.includes(player.id) === false &&
      colony.isActive);

    // TODO: Europa sometimes costs additional 3.
    if (PartyHooks.shouldApplyPolicy(player.game, PartyName.REDS) && !player.canAfford(this.cost + constants.REDS_RULING_POLICY_COST)) {
      openColonies = openColonies.filter((colony) => colony.name !== ColonyName.VENUS);
    }

    return openColonies;
  }

  public canAct(player: Player): boolean {
    return super.canAct(player) && this.getOpenColonies(player).length > 0;
  }

  actionEssence(player: Player): void {
    player.game.defer(new BuildColony(player, false, 'Select colony'));
  }
}
