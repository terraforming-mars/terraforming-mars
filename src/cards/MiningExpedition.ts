import { IProjectCard } from "./IProjectCard";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { CardName } from "../CardName";
import { MAX_OXYGEN_LEVEL, REDS_RULING_POLICY_COST } from "../constants";
import { PartyHooks } from "../turmoil/parties/PartyHooks";
import { PartyName } from "../turmoil/parties/PartyName";
import { RemoveAnyPlants } from "../deferredActions/RemoveAnyPlants";

export class MiningExpedition implements IProjectCard {
    public cost = 12;
    public tags = [];
    public cardType = CardType.EVENT;
    public name = CardName.MINING_EXPEDITION;
    public hasRequirements = false;

    public canPlay(player: Player, game: Game): boolean {
        const oxygenMaxed = game.getOxygenLevel() === MAX_OXYGEN_LEVEL;
    
        if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS) && !oxygenMaxed) {
          return player.canAfford(player.getCardCost(game, this) + REDS_RULING_POLICY_COST);
        }
    
        return true;
    }

    public play(player: Player, game: Game) {
        game.defer(new RemoveAnyPlants(player, game, 2));
        player.steel += 2;
        return game.increaseOxygenLevel(player, 1);
    }
}
