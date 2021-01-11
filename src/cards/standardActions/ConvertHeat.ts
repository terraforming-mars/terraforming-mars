import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';
import {Game} from '../../Game';
import * as constants from '../../constants';
import {REDS_RULING_POLICY_COST} from '../../constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {StandardActionCard} from './StandardActionCard';


export class ConvertHeat extends StandardActionCard {
  public name = CardName.CONVERT_HEAT;

  public canAct(player: Player, game: Game): boolean {
    if (game.getTemperature() === constants.MAX_TEMPERATURE) {
      return false;
    }
    if (player.availableHeat < constants.HEAT_FOR_TEMPERATURE) {
      return false;
    }

    if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
      return (!player.isCorporation(CardName.HELION) && player.canAfford(REDS_RULING_POLICY_COST)) ||
        player.canAfford(REDS_RULING_POLICY_COST + 8);
    }
    return true;
  }

  public action(player: Player, game: Game) {
    return player.spendHeat(constants.HEAT_FOR_TEMPERATURE, () => {
      this.actionPlayed(player, game);
      game.increaseTemperature(player, 1);
      return undefined;
    });
  }

  public metadata: CardMetadata = {
    cardNumber: 'SA2',
    renderData: CardRenderer.builder((b) =>
      b.standardProject('Spend 8 Heat to raise temperature 1 step.', (eb) => {
        eb.heat(8).startAction.temperature(1);
      }),
    ),
  };
}
