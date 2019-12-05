
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";

export class IoMiningIndustries implements IProjectCard {
    public cost: number = 41;
    public nonNegativeVPIcon: boolean = true;
    public tags: Array<Tags> = [Tags.JOVIAN, Tags.SPACE];
    public name: string = "Io Mining Industries";
    public cardType: CardType = CardType.AUTOMATED;
    public canPlay(): boolean {
        return true;
    }
    public onGameEnd(player: Player) {
        player.victoryPoints += player.getTagCount(Tags.JOVIAN);
    }
    public play(player: Player) {
        player.titaniumProduction += 2;
        player.megaCreditProduction += 2;
        return undefined;
    }
}
