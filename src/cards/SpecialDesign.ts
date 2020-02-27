
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

    public getRequirementBonus(player: Player, _game: Game): number {
        if (player.lastCardPlayed !== undefined && player.lastCardPlayed.name === this.name) {
            return 2;
        }
        return 0;
    }
    public play() {
        return undefined;
    }
}
