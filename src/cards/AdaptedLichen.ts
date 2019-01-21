
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class AdaptedLichen implements IProjectCard {
    public cost: number = 9;
    public tags: Array<Tags> = [Tags.PLANT];
    public cardType: CardType = CardType.AUTOMATED;
    public name: string = "Adapted Lichen";
    public text: string = "Increase your plant production 1 step";
    public description: string = "Suitable even for early terraforming";
    public play(player: Player, game: Game): Promise<void> {
        player.plantProduction++;
        return Promise.resolve();
    }
}
