
import { Tags } from "../Tags";

export abstract class CorporationCard {
    public abstract tags: Array<Tags>;
    public abstract name: string;
    public abstract startingMegaCredits: number;
    public skipInitialResearch: boolean = false;
}
