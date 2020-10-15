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
            return this.amount.toString();
        }
    }

    private parseType(): string {
        if (this.type === RequirementType.OCEANS && this.amount > 1) {
            return `${RequirementType.OCEANS}s`;
        }
        return this.type;
    }

    public getLabel(): string {
        const prefix = this.isMax ? "max " : "";

        return `${prefix}${this.amountToString()} ${this.parseType()}`;
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
 
    public getIsMax(): boolean {
        return this.isMax;
    }
}
