
import { Tags } from "./Tags";
import { IProjectCard } from "./IProjectCard";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Resources } from '../Resources';

export class PeroxidePower implements IProjectCard {
    public cost: number = 7;
    public tags: Array<Tags> = [Tags.ENERGY, Tags.STEEL];
    public cardType: CardType = CardType.AUTOMATED;
    public name: string = "Peroxide Power";
    public hasRequirements = false;
    public canPlay(player: Player): boolean {
        return player.getProduction(Resources.MEGACREDITS) >= -4;
    }
    public play(player: Player) {
        player.setProduction(Resources.MEGACREDITS,-1);
        player.setProduction(Resources.ENERGY,2);
        return undefined;
    }
}
