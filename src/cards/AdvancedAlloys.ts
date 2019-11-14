import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class AdvancedAlloys implements IProjectCard {
    public cost: number = 9;
    public nonNegativeVPIcon: boolean = true;
    public tags: Array<Tags> = [Tags.SCIENCE];
    public name: string = "Advanced Alloys";
    public cardType: CardType = CardType.ACTIVE;
    public text: string = "Each titanium you have is worth 1 mega credit extra. Each steel you have is worth 1 mega credit extra.";
    public requirements: undefined;
    public description: string = "The latest advances in metallargy give you an edge in the competition.";
    public canPlay(): boolean {
        return true;
    }
    public play(player: Player, _game: Game) {
        player.titaniumValue++;
        player.steelValue++;
        return undefined;
    }
}