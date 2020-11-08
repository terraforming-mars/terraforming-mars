import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { SelectSpace } from "../inputs/SelectSpace";
import { SpaceType } from "../SpaceType";
import { ISpace } from "../ISpace";
import { CardName } from "../CardName";
import { MAX_OXYGEN_LEVEL, REDS_RULING_POLICY_COST } from "../constants";
import { PartyHooks } from "../turmoil/parties/PartyHooks";
import { PartyName } from "../turmoil/parties/PartyName";

export class Mangrove implements IProjectCard {
    public cost = 12;
    public tags = [Tags.PLANT];
    public name = CardName.MANGROVE;
    public cardType = CardType.AUTOMATED;
    
    public canPlay(player: Player, game: Game): boolean {
        const meetsTemperatureRequirements = game.getTemperature() >= 4 - (2 * player.getRequirementsBonus(game));
        const oxygenMaxed = game.getOxygenLevel() === MAX_OXYGEN_LEVEL;
    
        if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS) && !oxygenMaxed) {
          return player.canAfford(player.getCardCost(game, this) + REDS_RULING_POLICY_COST, game, false, false, false, true) && meetsTemperatureRequirements;
        }
    
        return meetsTemperatureRequirements;
    }

    public play(player: Player, game: Game) {
        return new SelectSpace("Select ocean space for greenery tile", game.board.getAvailableSpacesForOcean(player), (foundSpace: ISpace) => {
            return game.addGreenery(player, foundSpace.id, SpaceType.OCEAN);
        });
    }
    public getVictoryPoints() {
        return 1;
    }
}
