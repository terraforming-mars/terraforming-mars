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
  public _cost = 14;

  public canAct(player: Player, game: Game): boolean {
    let asteroidCost = this._cost;
    if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) asteroidCost += REDS_RULING_POLICY_COST;

    return player.canAfford(asteroidCost) && game.getTemperature() < constants.MAX_TEMPERATURE;
  }

  actionEssence(player: Player, game: Game): void {
    game.increaseTemperature(player, 1);
  }

  public metadata: CardMetadata = {
    cardNumber: '',
    renderData: CardRenderer.builder((b) =>
      b.effectBox((eb) => {
        eb.megacredits(14).startAction.temperature(1);
        eb.description('Action: Spend 14 MC to raise temperature 1 step.');
      }),
    ),
  };
}
