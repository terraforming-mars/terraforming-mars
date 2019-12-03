
import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { CorporationCard } from "./CorporationCard";
import { IProjectCard } from "../IProjectCard";

export class SaturnSystems implements CorporationCard {
    public name: string = "Saturn Systems";
    public tags: Array<Tags> = [Tags.JOVIAN];
    public startingMegaCredits: number = 42;
    public onCardPlayed(player: Player, _game: Game, card: IProjectCard) {
        for (const tag of card.tags) {
            if (tag === Tags.JOVIAN) {
                player.megaCreditProduction++;
            }
        }
    }
    public play(player: Player) {
        player.titaniumProduction = 1;
        player.megaCreditProduction++;
        return undefined;
    }
}
