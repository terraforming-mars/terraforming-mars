
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Resources } from '../Resources';

export class PowerGrid implements IProjectCard {
    public cost: number = 18;
    public tags: Array<Tags> = [Tags.ENERGY];
    public name: string = "Power Grid";
    public cardType: CardType = CardType.AUTOMATED;

    public play(player: Player) {
        player.setProduction(Resources.ENERGY,1 + player.getTagCount(Tags.ENERGY));
        return undefined;
    }
}
