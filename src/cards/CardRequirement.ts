import { RequirementType } from "./RequirementType";
import { Tags } from "./Tags";
import { PartyName } from "../turmoil/parties/PartyName";
import { Resources } from "../Resources";
import { firstLetterUpperCase } from "../utils/utils";

export class CardRequirement {
    protected constructor(
        private type: RequirementType,
        protected amount: number,
        private isMax: boolean = false
    ) {}

    private amountToString(): string {
        if (this.type === RequirementType.OXYGEN || this.type === RequirementType.VENUS) {
            return `${this.amount}%`;
        } else if (this.type === RequirementType.TEMPERATURE) {
            return `${this.amount}°`;
        } else {
            return this.amount !== -1 ? this.amount.toString() : "";
        }
    }

    protected parseType(): string {
        const withPlural: Array<string> = [
            RequirementType.OCEANS,
            RequirementType.FLOATERS,
            RequirementType.FORESTS,
            RequirementType.CITIES,
            RequirementType.COLONIES,
            RequirementType.RESOURCE_TYPES,
        ];

        if (this.amount > 1 && withPlural.includes(this.type)) {
            return this.getTypePlural();
        }

        return this.type;
    }

    //TODO (chosta): add to a top level class - preferrably translatable
    public getTypePlural(): string {
        if (this.type === RequirementType.CITIES) {
            return "Cities";
        } else if (this.type === RequirementType.COLONIES) {
            return "Colonies";
        } else {
            return `${this.type}s`;
        }
    }

    public getLabel(): string {
        let result: string = this.isMax ? "max " : "";
        const amount = this.amountToString();
        if(amount !== ""){
            result += amount;
            result += " ";
        }
        result += this.parseType();

        return result;
    }

    public max(): CardRequirement {
        this.isMax = true;
        return this;
    }

    public static oceans(amount: number): CardRequirement {
        return new CardRequirement(RequirementType.OCEANS, amount);
    }

    public static oxygen(amount: number): CardRequirement {
        return new CardRequirement(RequirementType.OXYGEN, amount);
    }

    public static temperature(amount: number): CardRequirement {
        return new CardRequirement(RequirementType.TEMPERATURE, amount);
    }

    public static venus(amount: number): CardRequirement {
        return new CardRequirement(RequirementType.VENUS, amount);
    }

    public static tr(amount: number): CardRequirement {
        return new CardRequirement(RequirementType.TR, amount);
    }

    public static chairman(): CardRequirement {
        return new CardRequirement(RequirementType.CHAIRMAN, -1);
    }

    public static resourceTypes(amount: number): CardRequirement {
        return new CardRequirement(RequirementType.RESOURCE_TYPES, amount);
    }

    public static forests(amount: number): CardRequirement {
        return new CardRequirement(RequirementType.FORESTS, amount);
    }

    public static cities(amount: number): CardRequirement {
        return new CardRequirement(RequirementType.CITIES, amount);
    }

    public static colonies(amount: number): CardRequirement {
        return new CardRequirement(RequirementType.COLONIES, amount);
    }

    public static floaters(amount: number): CardRequirement {
        return new CardRequirement(RequirementType.FLOATERS, amount);
    }

    public static partyLeaders(amount: number): CardRequirement {
        return new CardRequirement(RequirementType.PARTY_LEADERS, amount);
    }

    public static tag(tag: Tags, amount: number): CardRequirement {
        return new TagCardRequirement(tag, amount);
    }

    public static production(resource: Resources, amount: number): CardRequirement {
        return new ProductionCardRequirement(resource, amount);
    }

    public static party(party: PartyName): CardRequirement {
        return new PartyCardRequirement(party);
    }

    public getIsMax(): boolean {
        return this.isMax;
    }
}

export class TagCardRequirement extends CardRequirement {
    constructor(private tag: Tags, amount: number) {
        super(RequirementType.TAG, amount);
    }

    protected parseType(): string {
        return firstLetterUpperCase(this.tag);
    }
}

export class ProductionCardRequirement extends CardRequirement {
    constructor(private resource: Resources, amount: number) {
        super(RequirementType.RESOURCE_TYPES, amount);
    }

    protected parseType(): string {
        return `${firstLetterUpperCase(this.resource)} production`;
    }
}

export class PartyCardRequirement extends CardRequirement {
    constructor(private party: PartyName) {
        super(RequirementType.PARTY, -1);
    }
    protected parseType(): string {
        return this.party.toLowerCase();
    }
}
