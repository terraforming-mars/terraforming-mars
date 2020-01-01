
import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { PreludeCard } from "./PreludeCard";

export class ResearchCoordination extends PreludeCard implements IProjectCard {
    public cost: number = 4;
    public tags: Array<Tags> = [Tags.WILDCARD];
    public name: string = "Research Coordination";
    public play() {
        return undefined;
    }
}
