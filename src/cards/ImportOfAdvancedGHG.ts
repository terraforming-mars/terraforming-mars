
import { CardType } from "./CardType";
import { Player } from "../Player";
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { Game } from "../Game";

export class ImportOfAdvancedGHG implements IProjectCard {
    public cardType: CardType = CardType.EVENT;
    public cost: number = 9;
    public tags: Array<Tags> = [Tags.EARTH, Tags.SPACE];
    public name: string = "Import of Advanced GHG";
    public text: string = "Increase your heat production 2 steps.";
    public description: string = "Greenhouse gases (GHG) with improved effect.";
    public play(player: Player, game: Game): Promise<void> {
        player.heatProduction += 2;
        return Promise.resolve();
    }
}
