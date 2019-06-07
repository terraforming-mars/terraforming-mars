
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Game } from "../Game";
import { Player } from "../Player";

export class SpecialDesign implements IProjectCard {
    public cost: number = 4;
    public tags: Array<Tags> = [Tags.SCIENCE];
    public cardType: CardType = CardType.EVENT;
    public name: string = "Special Design";
    public text: string = "The next card you play this generation is +2 or -2 in global requirements, your choice.";
    public description: string = "If it isn't feasible, then make it so.";
    public canPlay(): boolean {
        return true;
    }
    public getRequirementBonus(player: Player, game: Game): boolean {
        const lastCardPlayed = player.lastCardPlayedThisGeneration(game);
        if (lastCardPlayed !== undefined && lastCardPlayed.name === this.name) {
            return true;
        }
        return false;
    }
    public play() {
        return undefined;
    }
}
