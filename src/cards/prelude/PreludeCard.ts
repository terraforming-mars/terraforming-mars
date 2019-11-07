import { CardType } from "../CardType";
import { Player } from "../../Player";

export abstract class PreludeCard  {
    cost: number = 0;
    public cardType: CardType = CardType.AUTOMATED;
    public canPlay(_player: Player): boolean {
        return true;
    }
}
