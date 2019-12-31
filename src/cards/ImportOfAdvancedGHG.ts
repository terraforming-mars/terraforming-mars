
import { CardType } from "./CardType";
import { Player } from "../Player";
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { Game } from "../Game";
import { Resources } from "../Resources";

export class ImportOfAdvancedGHG implements IProjectCard {
    public cardType: CardType = CardType.EVENT;
    public cost: number = 9;
    public tags: Array<Tags> = [Tags.EARTH, Tags.SPACE];
    public name: string = "Import of Advanced GHG";
    public canPlay(): boolean {
        return true;
    }
    public play(player: Player, _game: Game) {
        player.setProduction(Resources.HEAT,2);
        return undefined;
    }
}
