
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { Player } from "../Player";
import { Game } from "../Game";
import { CardType } from "./CardType";
import { Resources } from "../Resources";

export class MicroMills implements IProjectCard {
    public cost: number = 3;
    public tags: Array<Tags> = [];
    public cardType: CardType = CardType.AUTOMATED;
    public name: string = "Micro-Mills";
    public canPlay(): boolean {
        return true;
    }
    public play(player: Player, _game: Game) {
        player.setProduction(Resources.HEAT);
        return undefined;
    }
}

