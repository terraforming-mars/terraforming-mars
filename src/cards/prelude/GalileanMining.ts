import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";

export class GalileanMining extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [Tags.JOVIAN];
	public cost: number = 5;
    public name: string = "Galilean Mining";
    public text: string = "Increase your titanium production 2 steps. Pay 5 MC.";
    public description: string = "The big moons of Jupiter are great for mining";
    public play(player: Player, _game: Game) {     
			player.titaniumProduction +=2;			
            return undefined;
    }
}

