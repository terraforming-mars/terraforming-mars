
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class ReleaseOfInertGases implements IProjectCard {
    public cost: number = 14;
    public tags: Array<Tags> = [];
    public name: string = "Release of Inert Gases";
    public cardType: CardType = CardType.EVENT;
    public text: string = "Raise your terraform rating 2 steps.";
    public requirements: undefined;
    public description: string = "We need some nitrogen and other inert gases to increase atmospheric pressure. Let's stay away from helium, though.";
    public canPlay(): boolean {
        return true;
    }
    public play(player: Player, _game: Game) {
        player.terraformRating += 2;
        return undefined;
    }
}
