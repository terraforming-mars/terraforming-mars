import { CardSpecial } from "./CardSpecial";
import { CardBonus } from "./CardBonus";
import { CardProductionBox } from "./CardProductionBox";

abstract class CauseAndEffect {
    protected constructor(
        protected cause: Array<CardBonus | CardSpecial> | undefined,
        protected effect: Array<CardBonus | CardSpecial | CardProductionBox> | undefined,
        protected description: string | undefined,
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
    public getEffect(): Array<CardBonus | CardSpecial | CardProductionBox | undefined> | undefined {
        return this.effect;
    }
    public getDescription(): string | undefined {
        return this.description;
    }
    public getDelimiter(): CardSpecial | undefined {
        return this.delimiter;
    }
    public abstract getDescriptionParsed(): string;
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
    public getDescriptionParsed(): string {
        return `Effect: ${this.getDescription()}.`;
    }
}

export class CardAction extends CauseAndEffect {
    public static add(
        cause: Array<CardBonus | CardSpecial> | undefined,
        effect: Array<CardBonus | CardSpecial | CardProductionBox> | undefined,
        description: string | undefined = undefined,
        delimiter: CardSpecial | undefined = CardSpecial.arrow()
    ): CardAction {
        return new CardAction(cause, effect, description, delimiter);
    }

    public getDescriptionParsed(): string {
        return `Action: ${this.getDescription()}.`;
    }
}
