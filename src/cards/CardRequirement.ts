import { RequirementType } from "./RequirementType";

export class CardRequirement {
    protected constructor(
        private type: RequirementType, 
        private amount: number, 
        private isMax: boolean = false) {
    }

    private amountToString(): string {
        if (this.type === RequirementType.OXYGEN || this.type === RequirementType.VENUS) {
            return `${this.amount}%`;
        } else if (this.type === RequirementType.TEMPERATURE) {
            return `${this.amount}°`;
        } else {
            return this.amount !== -1 ? this.amount.toString(): "";
        }
    }

    private parseType(): string {
        const withPlural: Array<string> = [
            RequirementType.OCEANS,
            RequirementType.FLOATERS,
            RequirementType.FORESTS,
            RequirementType.CITIES,
            RequirementType.COLONIES,
            RequirementType.RESOURCE_TYPES
        ];

        if (this.amount > 1 && withPlural.includes(this.type)) {
            return this.getTypePlural();
        }

        return this.type;
    }

    public getTypePlural(): string {
        if(this.type === RequirementType.CITIES) {
            return "Cities";
        } else if(this.type === RequirementType.COLONIES) {
            return "Colonies";
        } else {
            return `${this.type}s`;
        }
    }
     
    public getLabel(): string {
        const parts: Array<string> = [];
        const prefix = this.isMax ? "max" : "";
        const amount = this.amountToString();
        if(prefix !== "") {
            parts.push(prefix);
        }
        if(amount !== "") {
            parts.push(amount);
        }
        parts.push(this.parseType());

        return parts.join(" ");
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

    public getIsMax(): boolean {
        return this.isMax;
    }
}
