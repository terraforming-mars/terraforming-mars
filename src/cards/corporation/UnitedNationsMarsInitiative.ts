import { IActionCard } from "../ICard";
import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { CorporationCard } from "./CorporationCard";
import { CardName } from '../../CardName';
import { PartyHooks } from "../../turmoil/parties/PartyHooks";
import { PartyName } from "../../turmoil/parties/PartyName";
import { REDS_RULING_POLICY_COST } from "../../constants";

export class UnitedNationsMarsInitiative implements IActionCard, CorporationCard {
    public name: CardName = CardName.UNITED_NATIONS_MARS_INITIATIVE;
    public tags: Array<Tags> = [Tags.EARTH];
    public startingMegaCredits: number = 40;
    public play() {
        return undefined;
    }
    public canAct(player: Player, game: Game): boolean {
        const hasIncreasedTR = player.hasIncreasedTerraformRatingThisGeneration;
        const actionCost = 3;

        if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
            return hasIncreasedTR && player.canAfford(REDS_RULING_POLICY_COST + actionCost);
        }
        
        return hasIncreasedTR && player.canAfford(actionCost); 
    }
    public action(player: Player, game: Game) {
        player.megaCredits -= 3;
        player.increaseTerraformRating(game);
        return undefined;
    }
}
