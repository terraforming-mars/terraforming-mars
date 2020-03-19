
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { CardName } from '../CardName';

export class TransNeptuneProbe implements IProjectCard {
    public cost: number = 6;
    public tags: Array<Tags> = [Tags.SCIENCE, Tags.SPACE];
    public name: CardName = CardName.TRANS_NEPTUNE_PROBE;
    public cardType: CardType = CardType.AUTOMATED;

    public play() {
        return undefined;
    }
    public getVictoryPoints() {
        return 1;
    }
}
