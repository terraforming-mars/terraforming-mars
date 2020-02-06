
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Resources } from '../Resources';

export class Sponsors implements IProjectCard {
    public cost: number = 6;
    public tags: Array<Tags> = [Tags.EARTH];
    public name: string = "Sponsors";
    public cardType: CardType = CardType.AUTOMATED;

    public play(player: Player) {
        player.setProduction(Resources.MEGACREDITS,2);
        return undefined;
    }
}
