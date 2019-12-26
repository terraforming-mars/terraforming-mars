
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";

export class TransNeptuneProbe implements IProjectCard {
    public cost: number = 6;
    public tags: Array<Tags> = [Tags.SCIENCE, Tags.SPACE];
    public name: string = "Trans-Neptune Probe";
    public cardType: CardType = CardType.AUTOMATED;
    public canPlay(): boolean {
        return true;
    }
    public play() {
        return undefined;
    }
    public getVictoryPoints() {
        return 1;
    }
}
