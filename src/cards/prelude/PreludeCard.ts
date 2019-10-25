import { CardType } from "../CardType";

export abstract class PreludeCard  {
    cost: number = 0;
    public cardType: CardType = CardType.AUTOMATED;
    public canPlay(): boolean {
        return true;
    }

}
