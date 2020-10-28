import { CardSpecial } from "./CardSpecial";
import { CardBonus } from "./CardBonus";
import { CardProductionBox } from "./CardProductionBox";

abstract class CauseAndEffect {
    protected constructor(
        protected cause: Array<CardBonus | CardSpecial> | undefined,
        protected effect: Array<CardBonus | CardSpecial | CardProductionBox>,
        protected description: string,
        protected delimiter: CardSpecial | undefined
    ) {
        this.cause = cause;
        this.effect = effect;
        this.description = description;
        this.delimiter = delimiter;
    }
 
    public getCause(): Array<CardBonus | CardSpecial> | undefined {
        return this.cause;
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

export class CardEffect extends CauseAndEffect {
    public static add(
        cause: Array<CardBonus | CardSpecial> | undefined,
        effect: Array<CardBonus | CardSpecial | CardProductionBox>,
        description: string,
        delimiter: CardSpecial | undefined = undefined
    ): CardEffect {
        // don't show the ':' for the cases where we have permanent effect (like perma influence)
        return new CardEffect(
            cause,
            effect,
            description,
            cause === undefined ? undefined : delimiter || CardSpecial.colon()
        );
    }
};

export class CardAction extends CauseAndEffect {
    
}
