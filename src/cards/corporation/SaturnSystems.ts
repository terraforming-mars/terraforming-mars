
import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { CorporationCard } from "./CorporationCard";
import { IProjectCard } from "../IProjectCard";

export class SaturnSystems implements CorporationCard {
    public name: string = "Saturn Systems";
    public tags: Array<Tags> = [Tags.JOVIAN];
    public startingMegaCredits: number = 42;
    public text: string = "You start with 1 titanium production. Each time any jovian tag is put into play, including this, increase your mega credit production 1 step.";
    public description: string = "Having acquired the mining rights on several of Saturn's moons, Saturn Systems gained plenty of experience over the years. As a supplier of rare minerals, space ships, and fuel, the company has made itself indispensible to the outer planets. Saturn Systems is now ready to play a key role in the terraforming of Mars.";
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
