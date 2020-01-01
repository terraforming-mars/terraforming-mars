
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Resources } from '../Resources';

export class MirandaResort implements IProjectCard {
    public cost: number = 12;
    public tags: Array<Tags> = [Tags.JOVIAN, Tags.SPACE];
    public name: string = "Miranda Resort";
    public cardType: CardType = CardType.AUTOMATED;
    public canPlay(): boolean {
        return true;
    }
    public play(player: Player) {
        player.setProduction(Resources.MEGACREDITS, player.getTagCount(Tags.EARTH));
        return undefined;
    }
    public getVictoryPoints() {
        return 1;
    }
}
