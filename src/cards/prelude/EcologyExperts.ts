import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";

export class EcologyExperts extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [Tags.PLANT, Tags.MICROBES];
    public name: string = "Ecology Experts";
    public postPlay: boolean = true;
    public getRequirementBonus(player: Player, _game: Game): number {
        const lastCardPlayed = player.getLastCardPlayedThisTurn();
        if (lastCardPlayed !== undefined && lastCardPlayed.name === this.name) {
            // Magic number high enough to always ignore requirements.
            return 50;
        }
        return 0;
    }
    public play(player: Player, _game: Game) {  
        player.reduceActionsTakenThisRound();
        player.plantProduction++;
        return undefined;
    }
}

