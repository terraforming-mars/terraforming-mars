import { CardRequirement } from "./CardRequirement";

export class CardRequirements {
    public requirements: Array<CardRequirement>;
    constructor(reqs: Array<CardRequirement>) {
        this.requirements = reqs;
    }

    public getRequirementsText(): string {
        const reqTexts: Array<string> = this.requirements.map((req) => req.getRequirementText());
        return reqTexts.join(" ");
    }
    public hasMax(): boolean {
        return this.requirements.filter((req) => req.isMax).length > 0;
    }
}
