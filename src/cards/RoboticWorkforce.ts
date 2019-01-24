
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class RoboticWorkforce implements IProjectCard {
    public cost: number = 9;
    public tags: Array<Tags> = [Tags.SCIENCE];
    public name: string = "Robotic Workforce";
    public cardType: CardType = CardType.AUTOMATED;
    public text: string = "Duplicate only the production box of one of your building cards.";
    public description: string = "Enhancing your production capacity.";
    public play(player: Player, game: Game): Promise<void> {
        // TODO - Need to implement this
        // will have to find every building card and manually
        // write the logic here in a switch statement
        return Promise.resolve();
    }
}
