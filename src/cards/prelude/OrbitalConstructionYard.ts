import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";


export class OrbitalConstructionYard extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [Tags.SPACE];
    public name: string = "Orbital Construction Yard";
    public text: string = "Increase your titanium production 1 step. Gain 4 titanium.";
    public description: string = "Materials arrive to Earth orbit from all around the solar system, to be assembled into interplanerary vessels";
    public play(player: Player, _game: Game) {
			player.titaniumProduction++;
			player.titanium +=4;	
            return undefined;
    }
}

