import { CardSpecial } from "./CardSpecial";
import { CardBonus } from "./CardBonus";
import { CardProductionBox } from "./CardProductionBox";

export class CardEffect {
    private constructor(
        private condition: Array<CardBonus | CardSpecial> | undefined,
        private effect: Array<CardBonus | CardSpecial | CardProductionBox>,
        private description: string,
        private delimiter: CardSpecial | undefined
    ) {
        this.condition = condition;
        this.effect = effect;
        this.description = description;
        this.delimiter = delimiter;
    }

    public static add(
        condition: Array<CardBonus | CardSpecial> | undefined,
        effect: Array<CardBonus | CardSpecial | CardProductionBox>,
        description: string,
        delimiter: CardSpecial | undefined = undefined
    ): CardEffect {
        // don't show the ':' for the cases where we have permanent effect (like perma influence)
        return new CardEffect(
            condition,
            effect,
            description,
            condition === undefined ? undefined : delimiter || CardSpecial.colon()
        );
    }

    public getCondition(): Array<CardBonus | CardSpecial> | undefined {
        return this.condition;
    }
    public getInput(): Array<CardBonus | CardSpecial | CardProductionBox | undefined> {
        return this.effect;
    }
    public getDesrcription(): string {
        return this.description;
    }
    public getDescriptionParsed(): string {
        return `Effect: ${this.getDesrcription()}.`;
    }
    public getDelimiter(): CardSpecial | undefined {
        return this.delimiter;
    }
}
