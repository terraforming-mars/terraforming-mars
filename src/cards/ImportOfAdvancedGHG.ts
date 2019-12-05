
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
    public canPlay(): boolean {
        return true;
    }
    public play(player: Player, _game: Game) {
        player.heatProduction += 2;
        return undefined;
    }
}
