import { CardRequirement } from "./CardRequirement";

export class CardRequirements {
    public requirements: Array<CardRequirement>;
    constructor(reqs: Array<CardRequirement>) {
        this.requirements = reqs;
    }

    public static create(f: (r: CardRequirement) => void): CardRequirements {
        const result: Array<CardRequirement> = [];
        const requirement = new CardRequirement();
        f(requirement);
        result.push(requirement);

        return new CardRequirements(result);
    }

    public getRequirementsText(): string {
        const reqTexts: Array<string> = this.requirements.map((req) => req.getRequirementText());
        return reqTexts.join(" ");
    }
    public hasMax(): boolean {
        return this.requirements.some((req) => req.isMax);
    }
}
