
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { Resources } from "../Resources";
import { CardName } from '../CardName';

export class ImportedGHG implements IProjectCard {
    public cost: number = 7;
    public tags: Array<Tags> = [Tags.EARTH, Tags.SPACE];
    public name: CardName = CardName.IMPORTED_GHG;
    public cardType: CardType = CardType.EVENT;

    public play(player: Player, _game: Game) {
        player.addProduction(Resources.HEAT);
        player.heat += 3;
        return undefined;
    }
}
 
