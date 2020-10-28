import { CardBonus } from "./CardBonus";
import { CardEffect } from "./CauseAndEffect";
import { CardAction } from "./CardAction";
import { CardSpecial } from "./CardSpecial";

export class CardRow {
    private constructor(private data: Array<CardBonus | CardEffect | CardAction | CardSpecial>) {}
    public static add(data: Array<CardBonus | CardEffect | CardAction | CardSpecial>): CardRow {
        return new CardRow(data);
    }
    public getData(): Array<CardBonus | CardEffect | CardAction | CardSpecial> {
        return this.data;
    }
}
