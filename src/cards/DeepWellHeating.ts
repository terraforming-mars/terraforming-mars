import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { Resources } from "../Resources";
import { CardName } from "../CardName";
import { MAX_TEMPERATURE, REDS_RULING_POLICY_COST } from "../constants";
import { PartyHooks } from "../turmoil/parties/PartyHooks";
import { PartyName } from "../turmoil/parties/PartyName";

export class DeepWellHeating implements IProjectCard {
    public cost = 13;
    public tags = [Tags.ENERGY, Tags.STEEL];
    public name = CardName.DEEP_WELL_HEATING;
    public cardType = CardType.AUTOMATED;
    public hasRequirements = false;

    public canPlay(player: Player, game: Game): boolean {
      const temperatureMaxed = game.getVenusScaleLevel() === MAX_TEMPERATURE;
      if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS) && !temperatureMaxed) {
        return player.canAfford(player.getCardCost(game, this) + REDS_RULING_POLICY_COST, game, true);
      }

      return true;
    }

    public play(player: Player, game: Game) {
      player.addProduction(Resources.ENERGY);
      return game.increaseTemperature(player, 1);
    }
}
