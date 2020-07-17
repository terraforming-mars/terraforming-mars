import { IProjectCard } from "../IProjectCard";
import { CardName } from "../../CardName";
import { CardType } from "../CardType";
import { Tags } from "../Tags";
import { Player } from "../../Player";

export class MercurianAlloys implements IProjectCard {
    public name: CardName = CardName.MERCURIAN_ALLOYS;
    public cost: number = 3;
    public tags: Array<Tags> = [Tags.SPACE];
    public cardType: CardType = CardType.ACTIVE;

    public canPlay(player: Player): boolean {
        return player.getTagCount(Tags.SCIENCE) >= 2;
    }

    public play(player: Player) {
        player.increaseTitaniumValue();
        return undefined;
    }

}