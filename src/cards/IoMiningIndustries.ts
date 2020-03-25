
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Resources } from '../Resources';
import { CardName } from '../CardName';

export class IoMiningIndustries implements IProjectCard {
    public cost: number = 41;
    public tags: Array<Tags> = [Tags.JOVIAN, Tags.SPACE];
    public name: CardName = CardName.IO_MINING_INDUSTRIES;
    public cardType: CardType = CardType.AUTOMATED;

    public getVictoryPoints(player: Player) {
        return player.getTagCount(Tags.JOVIAN);
    }
    public play(player: Player) {
        player.setProduction(Resources.TITANIUM,2);
        player.setProduction(Resources.MEGACREDITS,2);
        return undefined;
    }
}
