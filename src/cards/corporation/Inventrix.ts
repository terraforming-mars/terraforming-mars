
import { CorporationCard } from "./CorporationCard";
import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";

export class Inventrix extends CorporationCard {
    public name: string = "Inventrix";
    public tags: Array<Tags> = [Tags.SCIENCE];
    public startingMegaCredits: number = 45;
    public text: string = "As your first action in the game, draw 3 cards.";
    public effect: string = "Your temperature, oxygen, and ocean requirements are +2 or -2 steps, your choice in each case.";
    public description: string = "Inventrix uses brains, as well as muscle, when competing with other mega-corps. Its motto being: \"Do it right\", Inventrix is focused on research.";
    public play(player: Player, game: Game): Promise<void> {
        player.requirementsBonus = 2;
        player.cardsInHand.push(game.dealer.getCards(1)[0]);
        player.cardsInHand.push(game.dealer.getCards(1)[0]);
        player.cardsInHand.push(game.dealer.getCards(1)[0]);
        return Promise.resolve();
    }
}
