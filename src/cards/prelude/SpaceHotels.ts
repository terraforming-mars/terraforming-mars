import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { Resources } from "../../Resources";
import { CardName } from "../../CardName";

export class SpaceHotels implements IProjectCard {
    public cost = 12;
    public tags = [Tags.SPACE, Tags.EARTH];
    public name = CardName.SPACE_HOTELS;
    public cardType = CardType.AUTOMATED;

    public canPlay(player: Player): boolean {
        return player.getTagCount(Tags.EARTH) >= 2; 
    }

    public play(player: Player) {
        player.addProduction(Resources.MEGACREDITS,4);
        return undefined;
    }
}
