import { RequirementType } from "./RequirementType";

export class CardRequirement {
    type: RequirementType;
    amount: number;
    isMax?: boolean = false;

    constructor(type: RequirementType, amount: number, isMax: boolean) {
        this.type = type;
        this.amount = amount;
        this.isMax = isMax;
    }

    private getParsedAmount(): string {
        if (this.type === RequirementType.OXYGEN) {
            return `${this.amount}%`;
        } else {
            return this.amount.toString();
        }
    }

    public getReqText(): string {
        const prefix = this.isMax ? "max" : "";
        const parsedAmount = this.getParsedAmount();

        return `${prefix} ${parsedAmount} ${this.type}`;
    }
}
