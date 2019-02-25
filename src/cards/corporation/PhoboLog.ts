
import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { CorporationCard } from "./CorporationCard";

export class PhoboLog implements CorporationCard {
    public name: string = "PhoboLog";
    public tags: Array<Tags> = [Tags.SPACE];
    public startingMegaCredits: number = 23;
    public text: string = "You start with 10 titanium.";
    public effect: string = "Your titanium resources are each worth 1 mega credit extra.";
    public description: string = "Aiming to be the leader in space solutions for the Mars era, PhoboLog acquired several national space programs. This allowed them access to much existing infrastructure and technology, and they are not going to let that advantage be wasted.";
    public play(player: Player, _game: Game) {
        player.titanium = 10;
        player.titaniumValue++;
        return undefined;
    }
}
