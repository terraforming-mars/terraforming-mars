
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class TerraformingGanymede implements IProjectCard {
    public cost: number = 33;
    public tags: Array<Tags> = [Tags.JOVIAN, Tags.SPACE];
    public name: string = "Terraforming Ganymede";
    public cardType: CardType = CardType.AUTOMATED;
    public text: string = "Raise your terraform rating 1 step for each jovian tag you have, including this. Gain 2 victory points.";
    public description: string = "Why stop at Mars?";
    public play(player: Player, game: Game): Promise<void> {
        player.terraformRating += 1 + player.getTagCount(Tags.JOVIAN);
        player.victoryPoints += 2;
        return Promise.resolve();
    }
}
