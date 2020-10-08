
import { CardType } from "./CardType";
import { Player } from "../Player";
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { Game } from "../Game";
import { Resources } from "../Resources";
import { CardName } from '../CardName';

export class ImportOfAdvancedGHG implements IProjectCard {
    public cardType: CardType = CardType.EVENT;
    public cost: number = 9;
    public tags: Array<Tags> = [Tags.EARTH, Tags.SPACE];
    public name: CardName = CardName.IMPORT_OF_ADVANCED_GHG;

    public play(player: Player, _game: Game) {
        player.addProduction(Resources.HEAT,2);
        return undefined;
    }
}
