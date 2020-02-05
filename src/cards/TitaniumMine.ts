
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { Resources } from '../Resources';

export class TitaniumMine implements IProjectCard {
    public cost: number = 7;
    public tags: Array<Tags> = [Tags.STEEL];
    public name: string = "Titanium Mine";
    public cardType: CardType = CardType.AUTOMATED;

    public play(player: Player, _game: Game) {
        player.setProduction(Resources.TITANIUM);
        return undefined;
    }
}
