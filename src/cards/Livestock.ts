
import { IActiveProjectCard } from "./IActiveProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Game } from "../Game";
import { Player } from "../Player";

export class Livestock implements IActiveProjectCard {
    public cost: number = 13;
    public cardType: CardType = CardType.ACTIVE;
    public animals: number = 0;
    public tags: Array<Tags> = [Tags.ANIMAL];
    public name: string = "Livestock";
    public text: string = "Requires 9% oxygen. Decrease your plant production 1 step and increase your mega credit production 2 steps.";
    public description: string = "Providing meat, wool, leather, etc.";
    public play(player: Player, game: Game): void {
        if (game.oxygenLevel < 9) {
            throw "Requires 9% oxygen";
        }
        if (player.plantProduction < 1) {
            throw "Must have plant production";
        }
        player.plantProduction--;
        player.megaCreditProduction += 2;
        const giveVPForAnimalsOnCard = () => {
            player.victoryPoints += this.animals;
        };
        game.addGameEndListener(giveVPForAnimalsOnCard);
    }
    public actionText: string = "Add an animal to this card";
    public action(player: Player, game: Game): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                this.animals++;
            } catch (err) { reject(err); return; }
            resolve();
        });
    }
}
    
