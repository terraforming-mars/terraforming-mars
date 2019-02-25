
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class Tardigrades implements IProjectCard {
    public cost: number = 4;
    public microbes: number = 0;
    public tags: Array<Tags> = [Tags.MICROBES];
    public name: string = "Tardigrades";
    public cardType: CardType = CardType.ACTIVE;
    public actionText: string = "Add 1 microbe to this card";
    public text: string = "Gain 1 victory point per 4 microbes on this card";
    public description: string = "These microscopic creatures can survive freezing, boiling, drying out, heavy radiation, and brute force";
    public play(player: Player, game: Game) {
        game.addGameEndListener(() => {
            player.victoryPoints += Math.floor(this.microbes / 4);
        });
        return undefined;
    }
    public action(_player: Player, _game: Game) {
        this.microbes++;
        return undefined;
    }
}
