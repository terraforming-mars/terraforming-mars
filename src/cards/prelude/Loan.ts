import { Tags } from "../Tags";
import { Player } from "../../Player";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";

export class Loan extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [];
    public name: string = "Loan";
    public canPlay(player: Player): boolean {
        return player.megaCreditProduction >= -3;
    }    
    public play(player: Player) {
        player.megaCreditProduction -= 2;
        player.megaCredits += 30;
        return undefined;
    }
}

