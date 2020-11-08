import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { CardName } from "../CardName";
import { MAX_TEMPERATURE, MAX_OCEAN_TILES, REDS_RULING_POLICY_COST } from "../constants";
import { PartyHooks } from "../turmoil/parties/PartyHooks";
import { PartyName } from "../turmoil/parties/PartyName";
import { PlaceOceanTile } from "../deferredActions/PlaceOceanTile";
import { RemoveAnyPlants } from "../deferredActions/RemoveAnyPlants";

export class Comet implements IProjectCard {
    public cost = 21;
    public tags = [Tags.SPACE];
    public name = CardName.COMET;
    public cardType = CardType.EVENT;
    public hasRequirements = false;

    public canPlay(player: Player, game: Game): boolean {
        const temperatureStep = game.getTemperature() < MAX_TEMPERATURE ? 1 : 0;
        const oceanStep = game.board.getOceansOnBoard() < MAX_OCEAN_TILES ? 1 : 0;
        const totalSteps = temperatureStep + oceanStep;

        if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
            return player.canAfford(player.getCardCost(game, this) + REDS_RULING_POLICY_COST * totalSteps, game, false, true);
        }

        return true;
    }

    public play(player: Player, game: Game) {
        game.increaseTemperature(player, 1);
        game.defer(new PlaceOceanTile(player, game));
        game.defer(new RemoveAnyPlants(player, game, 3));
        return undefined;
    }
}
