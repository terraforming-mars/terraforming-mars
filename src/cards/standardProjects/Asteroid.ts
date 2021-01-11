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

export class AsteroidStandard extends StandardProjectCard {
  public name = CardName.STANDARD_ASTEROID;
  public cost = 14;

  public canAct(player: Player, game: Game): boolean {
    let asteroidCost = this.cost;
    if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) asteroidCost += REDS_RULING_POLICY_COST;

    return player.canAfford(asteroidCost) && game.getTemperature() < constants.MAX_TEMPERATURE;
  }

  actionEssence(player: Player, game: Game): void {
    game.increaseTemperature(player, 1);
  }

  public metadata: CardMetadata = {
    cardNumber: 'SP9',
    renderData: CardRenderer.builder((b) =>
      b.standardProject('Spend 14 MC to raise temperature 1 step.', (eb) => {
        eb.megacredits(14).startAction.temperature(1);
      }),
    ),
  };
}
