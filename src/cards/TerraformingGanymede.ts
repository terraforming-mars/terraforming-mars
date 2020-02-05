
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

    public play(player: Player, _game: Game) {
        player.terraformRating += 1 + player.getTagCount(Tags.JOVIAN);
        return undefined;
    }
    public getVictoryPoints() {
        return 2;
    }
}
