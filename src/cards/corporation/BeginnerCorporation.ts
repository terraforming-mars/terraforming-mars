
import { Tags } from "../Tags";
import { CorporationCard } from "./CorporationCard";
import { Player } from "../../Player";
import { Game } from "../../Game";

export class BeginnerCorporation implements CorporationCard {
    public tags: Array<Tags> = [];
    public startingMegaCredits: number = 42;
    public name: string = "Beginner Corporation";
    public play(player: Player, game: Game) {
        for (let i = 0; i < 10; i++) { 
            player.cardsInHand.push(game.dealer.dealCard());
        }
        return undefined;
    }
}
