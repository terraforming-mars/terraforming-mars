
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class TechnologyDemonstration implements IProjectCard {
    public cost: number = 5;
    public tags: Array<Tags> = [Tags.SCIENCE, Tags.SPACE];
    public cardType: CardType = CardType.EVENT;
    public name: string = "Technology Demonstration";
    public text: string = "Draw 2 cards";
    public description: string = "Testing launch techniques, space hardware, and whatnot";
    public play(player: Player, game: Game) {
        for (let i = 0; i < 2; i++) {
            player.cardsInHand.push(game.dealer.dealCard());
        }
        return undefined;
    }
}

