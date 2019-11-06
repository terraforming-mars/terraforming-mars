
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class BribedCommitte implements IProjectCard {
    public cost: number = 7;
    public tags: Array<Tags> = [Tags.EARTH];
    public cardType: CardType = CardType.EVENT;
    public name: string = "Bribed Committe";
    public text: string = "Raise your terraform rating 2 steps. Lose 2 victory points.";
    public requirements: undefined;
    public description: string = "Influencing the people in power.";
    public canPlay(): boolean {
        return true;
    }
    public play(player: Player, _game: Game) {
        player.terraformRating += 2;
        player.victoryPoints -= 2;
        return undefined;
    }
}
