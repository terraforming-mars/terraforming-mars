
import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { Resources } from '../../Resources';

export class SpaceHotels implements IProjectCard {
    public cost: number = 12;
    public tags: Array<Tags> = [Tags.SPACE, Tags.EARTH];
    public name: string = "Space Hotels";
    public cardType: CardType = CardType.AUTOMATED;
    public canPlay(player: Player): boolean {
       return player.getTagCount(Tags.EARTH) >= 2; 
    }
    public play(player: Player) {
        player.setProduction(Resources.MEGACREDITS,4);
        return undefined;
    }
}
