import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";

export class UNMIContractor extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [Tags.EARTH];
    public name: string = "UNMI Contractor";
    public text: string = "Raise your terraform rating 3 steps. Draw 1 card.";
    public requirements: undefined;
    public description: string = "Your early terraforming work for UNMI is taken into account by the ???? Committee";
    public play(player: Player, game: Game) {
        player.terraformRating += 3;
	    player.cardsInHand.push(game.dealer.dealCard());
	    return undefined;   
    }
}

