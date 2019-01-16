
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class Decomposers implements IProjectCard {
    public cost: number = 5;
    public microbes: number = 0;
    public tags: Array<Tags> = [Tags.MICROBES];
    public cardType: CardType = CardType.ACTIVE;
    public name: string = "Decomposers";
    public text: string = "Requires 3% oxygen. When you play an animal, plant, or microbe tag, including this, add a microbe to this card. 1 VP per 3 microbes on this card.";
    public description: string = "Decomposing dead organisms is essential to making sustainable soil.";
    public play(player: Player, game: Game): Promise<void> {
        if (game.getOxygenLevel() < 3) {
            return Promise.reject("Requires 3% oxygen");
        }
        player.addCardPlayedHandler((card: IProjectCard) => {
            if (card.tags.indexOf(Tags.ANIMAL) !== -1 || card.tags.indexOf(Tags.MICROBES) !== -1 || card.tags.indexOf(Tags.PLANT) !== -1) {
                this.microbes++;
            }
        });
        game.addGameEndListener(() => {
            player.victoryPoints += Math.floor(this.microbes / 3);
        });
    }
}

