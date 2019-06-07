
import { IActionCard } from "./ICard";
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Game } from "../Game";
import { Player } from "../Player";

export class Livestock implements IActionCard, IProjectCard {
    public cost: number = 13;
    public cardType: CardType = CardType.ACTIVE;
    public animals: number = 0;
    public tags: Array<Tags> = [Tags.ANIMAL];
    public name: string = "Livestock";
    public text: string = "Requires 9% oxygen. Decrease your plant production 1 step and increase your mega credit production 2 steps. Gain 1 victory point per animal on this card";
    public description: string = "Providing meat, wool, leather, etc.";
    public canPlay(player: Player, game: Game): boolean {
        return game.getOxygenLevel() >= 9 - player.getRequirementsBonus(game) && player.plantProduction >= 1;
    }
    public play(player: Player, game: Game) {
        player.plantProduction--;
        player.megaCreditProduction += 2;
        const giveVPForAnimalsOnCard = () => {
            player.victoryPoints += this.animals;
        };
        game.addGameEndListener(giveVPForAnimalsOnCard);
        return undefined;
    }
    public actionText: string = "Add an animal to this card";
    public canAct(): boolean {
        return true;
    }
    public action() {
        this.animals++;
        return undefined;
    }
}
    
