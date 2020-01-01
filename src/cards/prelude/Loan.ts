import { Tags } from "../Tags";
import { Player } from "../../Player";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";
import { Resources } from '../../Resources';

export class Loan extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [];
    public name: string = "Loan";
    public canPlay(player: Player): boolean {
        return player.getProduction(Resources.MEGACREDITS) >= -3;
    }    
    public play(player: Player) {
        player.setProduction(Resources.MEGACREDITS,-2);
        player.megaCredits += 30;
        return undefined;
    }
}

