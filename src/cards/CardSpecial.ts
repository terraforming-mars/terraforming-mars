import { CardSpecialType } from "./CardSpecialType";

export class CardSpecial {
    private constructor(private type: CardSpecialType, private isIcon: boolean = false) {}
    public getType(): CardSpecialType {
        return this.type;
    }
    public getIsIcon(): boolean {
        return this.isIcon;
    }
    public static asterix(): CardSpecial {
        return new CardSpecial(CardSpecialType.ASTERIX);
    }
    public static or(): CardSpecial {
        return new CardSpecial(CardSpecialType.OR);
    }
    public static plus(): CardSpecial {
        return new CardSpecial(CardSpecialType.PLUS, true);
    }
    public static minus(): CardSpecial {
        return new CardSpecial(CardSpecialType.MINUS, true);
    }
}
