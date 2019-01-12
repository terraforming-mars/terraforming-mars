
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class ImportedGHG implements IProjectCard {
    public cost: number = 7;
    public tags: Array<Tags> = [Tags.EARTH, Tags.SPACE];
    public name: string = "Imported GHG";
    public cardType: CardType = CardType.EVENT;
    public text: string = "Increase your heat production 1 step and gain 3 heat";
    public description: string = "Greenhouse gases (GHG) to retain the heat.";
    public play(player: Player, game: Game): Promise<void> {
        return new Promise((resolve, reject) => {
            player.heatProduction++;
            player.heat += 3;
            resolve();
        });
    }
}
 
