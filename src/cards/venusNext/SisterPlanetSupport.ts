import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { Resources } from "../../Resources";

export class SisterPlanetSupport implements IProjectCard {
    public cost: number = 7;
    public tags: Array<Tags> = [Tags.VENUS, Tags.EARTH];
    public name: string = "Sister Planet Support";
    public cardType: CardType = CardType.AUTOMATED;
    public canPlay(player: Player): boolean {
        return player.getTagCount(Tags.VENUS) >= 1 && player.getTagCount(Tags.EARTH) >= 1 ;
      }
    public play(player: Player) {
        player.setProduction(Resources.MEGACREDITS,3);
        return undefined;
    }
}