
import { IProjectCard } from "./IProjectCard";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { CardName } from "../CardName";

export class MineralDeposit implements IProjectCard {
    public cost = 5;
    public tags = [];
    public name = CardName.MINERAL_DEPOSIT;
    public cardType = CardType.EVENT;

    public play(player: Player, _game: Game) {
        player.steel += 5;
        return undefined;
    }
}
