import { CardRequirement, PartyCardRequirement } from "./CardRequirement";
export class CardRequirements {
    constructor(private requirements: Array<CardRequirement>) {
    }
 
    public getRequirementsText(): string {
        const reqTexts: Array<string> = this.requirements.map((req) => req.getLabel());
        return reqTexts.join(" ");
    }
    public hasMax(): boolean {
        return this.requirements.some((req) => req.getIsMax());
    }
    public hasParty(): boolean {
        return this.requirements.some((req) => req instanceof PartyCardRequirement);
    }
}
