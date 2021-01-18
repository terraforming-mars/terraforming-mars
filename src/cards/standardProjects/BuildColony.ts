import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';
import {Game} from '../../Game';
import {StandardProjectCard} from './StandardProjectCard';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import * as constants from '../../constants';
import {ColonyName} from '../../colonies/ColonyName';
import {BuildColony} from '../../deferredActions/BuildColony';

export class BuildColonyStandard extends StandardProjectCard {
  public name = CardName.STANDARD_BUILD_COLONY;
  public cost = 17;

  private getOpenColonies(player: Player, game: Game) {
    let openColonies = game.colonies.filter((colony) => colony.colonies.length < 3 &&
      colony.colonies.indexOf(player.id) === -1 &&
      colony.isActive);

    // TODO: Europa sometimes costs additional 3.
    if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS) && !player.canAfford(this.cost + constants.REDS_RULING_POLICY_COST)) {
      openColonies = openColonies.filter((colony) => colony.name !== ColonyName.VENUS);
    }

    return openColonies;
  }

  public canAct(player: Player, game: Game): boolean {
    return super.canAct(player, game) && this.getOpenColonies(player, game).length > 0;
  }

  actionEssence(player: Player, game: Game): void {
    game.defer(new BuildColony(player, false, 'Select colony'));
  }

  public metadata: CardMetadata = {
    cardNumber: 'SP5',
    renderData: CardRenderer.builder((b) =>
      b.standardProject('Spend 17 MC to place a colony.', (eb) => {
        eb.megacredits(17).startAction.colonies();
      }),
    ),
  };
}
