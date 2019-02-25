
import { Tags } from "../Tags";
import { CorporationCard } from "./CorporationCard";
import { Player } from "../../Player";
import { Game } from "../../Game";

export class BeginnerCorporation implements CorporationCard {
    public tags: Array<Tags> = [];
    public startingMegaCredits: number = 42;
    public name: string = "Beginner Corporation";
    public text: string = "Instead of choosing from 10 cards during setup, you get 10 cards for free.";
    public description: string = "This is a standard corporation, doing standard things. There are no special effects or actions to keep track of. This is a good corporation to start with if you are terraforming a planet for the first time.";
    public play(_player: Player, _game: Game) {
        return undefined;
    }
}
