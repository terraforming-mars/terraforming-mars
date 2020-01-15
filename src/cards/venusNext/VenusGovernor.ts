import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { Resources } from "../../Resources";

export class VenusGovernor implements IProjectCard {
    public cost: number = 4;
    public tags: Array<Tags> = [Tags.VENUS, Tags.VENUS];
    public name: string = "Venus Governor";
    public cardType: CardType = CardType.AUTOMATED;
    public canPlay(player: Player): boolean {
        return player.getTagCount(Tags.VENUS) >= 2 ;
      }
    public play(player: Player) {
        player.setProduction(Resources.MEGACREDITS,2);
        return undefined;
    }
}