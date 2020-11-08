import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { CardName } from "../CardName";
import { MAX_OCEAN_TILES, MAX_TEMPERATURE, REDS_RULING_POLICY_COST } from "../constants";
import { PartyHooks } from "../turmoil/parties/PartyHooks";
import { PartyName } from "../turmoil/parties/PartyName";
import { PlaceOceanTile } from "../deferredActions/PlaceOceanTile";
import { RemoveAnyPlants } from "../deferredActions/RemoveAnyPlants";

export class GiantIceAsteroid implements IProjectCard {
    public cost = 36;
    public tags = [Tags.SPACE];
    public name = CardName.GIANT_ICE_ASTEROID;
    public cardType = CardType.EVENT;
    public hasRequirements = false;

    public canPlay(player: Player, game: Game): boolean {
        const remainingOceans = MAX_OCEAN_TILES - game.board.getOceansOnBoard();
        const remainingTemperatureSteps = (MAX_TEMPERATURE - game.getTemperature()) / 2;
        const stepsRaised = Math.min(remainingTemperatureSteps, 2) + Math.min(remainingOceans, 2);
  
        if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
            return player.canAfford(player.getCardCost(game, this) + REDS_RULING_POLICY_COST * stepsRaised, game, false, true);
        }
  
        return true;
    }

    public play(player: Player, game: Game) {
        game.increaseTemperature(player, 2);
        game.defer(new PlaceOceanTile(player, game, "Select space for first ocean"));
        game.defer(new PlaceOceanTile(player, game, "Select space for second ocean"));
        game.defer(new RemoveAnyPlants(player, game, 6));
        return undefined;
    }
}
