import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";

export class EccentricSponsor extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [];
    public name: string = "Eccentric Sponsor";
    public text: string = "Next card you play this turn will have a 25 MC reduction. Playing this card does not count as an action";
    public requirements: undefined;
    public postPlay: boolean = true;
    public description: string = "He will support you, but he wants something big with his name on it";

    public getCardDiscount(player: Player, game: Game) {
        const lastCardPlayed = player.lastCardPlayedThisGeneration(game);
        if (lastCardPlayed !== undefined && lastCardPlayed.name === this.name) {
            return 25;
        }
        return 0;
    }

    public play(player: Player, _game: Game) {  
        player.reduceActionsTakenThisRound();	
        return undefined;    
    }
}

