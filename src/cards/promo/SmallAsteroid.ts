import { IProjectCard } from "../IProjectCard";
import { CardName } from "../../CardName";
import { CardType } from "../CardType";
import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { PartyHooks } from "../../turmoil/parties/PartyHooks";
import { PartyName } from "../../turmoil/parties/PartyName";
import { REDS_RULING_POLICY_COST, MAX_TEMPERATURE } from "../../constants";
import { RemoveAnyPlants } from "../../deferredActions/RemoveAnyPlants";

export class SmallAsteroid implements IProjectCard {
    public cost = 10;
    public name = CardName.SMALL_ASTEROID;
    public tags = [Tags.SPACE];
    public cardType = CardType.EVENT;
    public hasRequirements = false;

    public canPlay(player: Player, game: Game): boolean {
        const canRaiseTemperature = game.getTemperature() < MAX_TEMPERATURE;
        if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS) && canRaiseTemperature) {
          return player.canAfford(player.getCardCost(game, this) + REDS_RULING_POLICY_COST, game, false, true);
        }
  
        return true;
    }

    public play(player: Player, game: Game) {
        game.increaseTemperature(player, 1);
        game.defer(new RemoveAnyPlants(player, game, 2));
        return undefined;
    }

}
