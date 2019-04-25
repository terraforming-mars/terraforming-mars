
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Game } from "../Game";
import { Player } from "../Player";

export class Livestock implements IProjectCard {
    public cost: number = 13;
    public cardType: CardType = CardType.ACTIVE;
    public animals: number = 0;
    public tags: Array<Tags> = [Tags.ANIMAL];
    public name: string = "Livestock";
    public text: string = "Requires 9% oxygen. Decrease your plant production 1 step and increase your mega credit production 2 steps. Gain 1 victory point per animal on this card";
    public description: string = "Providing meat, wool, leather, etc.";
    public canPlay(player: Player, game: Game): boolean {
        return game.getOxygenLevel() >= 9 && player.plantProduction >= 1;
    }
    public play(player: Player, game: Game) {
        if (game.getOxygenLevel() < 9) {
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
        return undefined;
    }
    public actionText: string = "Add an animal to this card";
    public action(_player: Player, _game: Game) {
        this.animals++;
        return undefined;
    }
}
    
