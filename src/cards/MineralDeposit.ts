
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { CardName } from '../CardName';

export class MineralDeposit implements IProjectCard {
    public cost: number = 5;
    public tags: Array<Tags> = [];
    public name: CardName = CardName.MINERAL_DEPOSIT;
    public cardType: CardType = CardType.EVENT;

    public play(player: Player, _game: Game) {
        player.steel += 5;
        return undefined;
    }
}
