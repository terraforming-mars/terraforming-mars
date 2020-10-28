import { CardSpecialType } from "./CardSpecialType";
import { ComponentSize } from "../components/card/ComponentSize";

export class CardSpecial {
    private constructor(
        private type: CardSpecialType,
        private isIcon: boolean = false,
        private size: ComponentSize = ComponentSize.MEDIUM
    ) {}
    public getType(): CardSpecialType {
        return this.type;
    }
    public getIsIcon(): boolean {
        return this.isIcon;
    }
    public getSize(): ComponentSize {
        return this.size;
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
    public static empty(): CardSpecial {
        return new CardSpecial(CardSpecialType.EMPTY);
    }
    public static slash(): CardSpecial {
        return new CardSpecial(CardSpecialType.SLASH);
    }
    public static colon(): CardSpecial {
        return new CardSpecial(CardSpecialType.COLON);
    }
    public small(): CardSpecial {
        this.size = ComponentSize.SMALL;
        return this;
    }
    public medium(): CardSpecial {
        this.size = ComponentSize.MEDIUM;
        return this;
    }
    public large(): CardSpecial {
        this.size = ComponentSize.LARGE;
        return this;
    }
}
