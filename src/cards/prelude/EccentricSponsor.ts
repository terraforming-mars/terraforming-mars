import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";

export class EccentricSponsor extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [];
    public name: string = "Eccentric Sponsor";
    public postPlay: boolean = true;

    public getCardDiscount(player: Player, game: Game) {
        const lastCardPlayed = player.lastCardPlayedThisGeneration(game);
        if (lastCardPlayed !== undefined && lastCardPlayed.name === this.name) {
            return 25;
        }
        return 0;
    }

    public play(player: Player) {
        player.reduceActionsTakenThisRound();	
        return undefined;
    }
}

