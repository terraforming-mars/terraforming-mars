
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Resources } from '../Resources';
import { CardName } from '../CardName';

export class MirandaResort implements IProjectCard {
    public cost: number = 12;
    public tags: Array<Tags> = [Tags.JOVIAN, Tags.SPACE];
    public name: CardName = CardName.MIRANDA_RESORT;
    public cardType: CardType = CardType.AUTOMATED;

    public play(player: Player) {
        player.addProduction(Resources.MEGACREDITS, player.getTagCount(Tags.EARTH));
        return undefined;
    }
    public getVictoryPoints() {
        return 1;
    }
}
