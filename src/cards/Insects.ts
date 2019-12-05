
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class Insects implements IProjectCard {
    public cost: number = 9;
    public tags: Array<Tags> = [Tags.MICROBES];
    public cardType: CardType = CardType.AUTOMATED;
    public name: string = "Insects";
    public canPlay(player: Player, game: Game): boolean {
        return game.getOxygenLevel() >= 6 - player.getRequirementsBonus(game);
    }
    public play(player: Player) {
        player.plantProduction += player.getTagCount(Tags.PLANT);
        return undefined;
    }
}
