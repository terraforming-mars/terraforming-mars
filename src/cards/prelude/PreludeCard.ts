import { CardType } from "../CardType";
import { Player } from "../../Player";
import { Game } from "../../Game";

export abstract class PreludeCard  {
    public cost: number = 0;
    public cardType: CardType = CardType.PRELUDE;
    public hasRequirements = false;
    public canPlay(_player: Player, _game: Game, _bonusMc: number = 0): boolean {
        return true;
    }
}
