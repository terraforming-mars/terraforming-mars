import { CardSpecialType } from "./CardSpecialType";

export class CardSpecial {
    private constructor(private type: CardSpecialType) {}
    public getType(): CardSpecialType {
        return this.type;
    }
    public static asterix(): CardSpecial {
        return new CardSpecial(CardSpecialType.ASTERIX);
    }
    public static or(): CardSpecial {
        return new CardSpecial(CardSpecialType.OR);
    }
    public static plus(): CardSpecial {
        return new CardSpecial(CardSpecialType.PLUS);
    }
    public static minus(): CardSpecial {
        return new CardSpecial(CardSpecialType.MINUS);
    }
}
