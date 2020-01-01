
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Resources } from '../Resources';

export class GiantSpaceMirror implements IProjectCard {
    public cost: number = 17;
    public tags: Array<Tags> = [Tags.ENERGY, Tags.SPACE];
    public name: string = "Giant Space Mirror";
    public cardType: CardType = CardType.AUTOMATED;
    public canPlay(): boolean {
        return true;
    }
    public play(player: Player) {
        player.setProduction(Resources.ENERGY,3);
        return undefined;
    }
}
