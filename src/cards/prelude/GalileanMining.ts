import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";

export class GalileanMining extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [Tags.JOVIAN];
    public name: string = "Galilean Mining";
    public play(player: Player, _game: Game) {     
            player.titaniumProduction +=2;	
            player.megaCredits -=5;		
            return undefined;
    }
}

