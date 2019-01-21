
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class GiantSpaceMirror implements IProjectCard {
    public cost: number = 17;
    public tags: Array<Tags> = [Tags.ENERGY, Tags.SPACE];
    public name: string = "Giant Space Mirror";
    public cardType: CardType = CardType.AUTOMATED;
    public text: string = "Increase your energy production 3 steps.";
    public description: string = "Square kilometers of extra sunlight reflected down to a receiving power plant.";
    public play(player: Player, game: Game): Promise<void> {
        player.energyProduction += 3;
        return Promise.resolve();
    }
}
