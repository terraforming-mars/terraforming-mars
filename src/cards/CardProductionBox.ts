import { CardBonus } from "./CardBonus";
import { CardSpecial } from "./CardSpecial";

export class CardProductionBox {
    private constructor(private data: Array<Array<CardBonus | CardSpecial>>) {}
    public static add(data: Array<Array<CardBonus | CardSpecial>>): CardProductionBox {
        return new CardProductionBox(data);
    }
    public getData(): Array<Array<CardBonus | CardSpecial>> {
        return this.data;
    }
}
