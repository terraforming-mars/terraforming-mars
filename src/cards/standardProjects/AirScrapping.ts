import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';
import {Game} from '../../Game';
import {REDS_RULING_POLICY_COST} from '../../constants';
import {StandardProjectCard} from './StandardProjectCard';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import * as constants from '../../constants';

export class AirScrapping extends StandardProjectCard {
  public name = CardName.STANDARD_AIR_SCRAPPING;
  public cost = 15;

  public canAct(player: Player, game: Game): boolean {
    let cost = this.cost;
    if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) cost += REDS_RULING_POLICY_COST;

    return player.canAfford(cost) && game.getVenusScaleLevel() < constants.MAX_VENUS_SCALE;
  }

  actionEssence(player: Player, game: Game): void {
    game.increaseVenusScaleLevel(player, 1);
  }

  public metadata: CardMetadata = {
    cardNumber: 'SP1',
    renderData: CardRenderer.builder((b) =>
      b.standardProject('Spend 15 MC to raise Venus 1 step.', (eb) => {
        eb.megacredits(15).startAction.venus(1);
      }),
    ),
  };
}
