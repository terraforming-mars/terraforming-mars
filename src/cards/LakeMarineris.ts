import { IProjectCard } from "./IProjectCard";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { CardName } from "../CardName";
import { MAX_OCEAN_TILES, REDS_RULING_POLICY_COST } from "../constants";
import { PartyHooks } from "../turmoil/parties/PartyHooks";
import { PartyName } from "../turmoil/parties/PartyName";
import { PlaceOceanTile } from "../deferredActions/PlaceOceanTile";

export class LakeMarineris implements IProjectCard {
    public cost = 18;
    public tags = [];
    public name = CardName.LAKE_MARINERIS;
    public cardType = CardType.AUTOMATED;
    public canPlay(player: Player, game: Game): boolean {
        const meetsTemperatureRequirements = game.getTemperature() >= 0 - (2 * player.getRequirementsBonus(game));
        const remainingOceans = MAX_OCEAN_TILES - game.board.getOceansOnBoard();
        const oceansPlaced = Math.min(remainingOceans, 2);
  
        if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
            return player.canAfford(player.getCardCost(game, this) + REDS_RULING_POLICY_COST * oceansPlaced) && meetsTemperatureRequirements;
        }
  
        return meetsTemperatureRequirements;
    }

    public play(player: Player, game: Game) {
        game.defer(new PlaceOceanTile(player, game, "Select space for first ocean"));
        game.defer(new PlaceOceanTile(player, game, "Select space for second ocean"));
        return undefined;
    }
    public getVictoryPoints() {
        return 2;
    }
}
