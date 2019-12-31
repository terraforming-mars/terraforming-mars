
import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { CorporationCard } from "./CorporationCard";
import { IProjectCard } from "../IProjectCard";

export class SaturnSystems implements CorporationCard {
    public name: string = "Saturn Systems";
    public tags: Array<Tags> = [Tags.JOVIAN];
    public startingMegaCredits: number = 42; 
    public onCardPlayed(_player: Player, game: Game, card: IProjectCard) {
        for (const tag of card.tags) {
            if (tag === Tags.JOVIAN) {
                game.getCardPlayer(this.name).megaCreditProduction++;
            }
        }
    }
    public play(player: Player) {
        player.titaniumProduction = 1;
        player.megaCreditProduction++;
        return undefined;
    }
}
