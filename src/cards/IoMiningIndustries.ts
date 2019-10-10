
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";

export class IoMiningIndustries implements IProjectCard {
    public cost: number = 41;
    public tags: Array<Tags> = [Tags.JOVIAN, Tags.SPACE];
    public name: string = "Io Mining Industries";
    public cardType: CardType = CardType.AUTOMATED;
    public text: string = "Increase your titanium production 2 steps and your mega credit production 2 steps. Gain 1 victory point per jovian tag you have.";
    public description: string = "Supplying fuel and valuable minerals.";
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
