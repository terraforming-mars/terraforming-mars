
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class MineralDeposit implements IProjectCard {
    public cost: number = 5;
    public tags: Array<Tags> = [];
    public name: string = "Mineral Deposit";
    public cardType: CardType = CardType.EVENT;
    public text: string = "Gain 5 steel";
    public description: string = "Still mostly untouched, Mars offers easy access to many useful minerals";
    public play(player: Player, _game: Game) {
        player.steel += 5;
        return undefined;
    }
}
