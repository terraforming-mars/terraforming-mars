import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardName } from "../../CardName";
import { CardType } from "../CardType";
import { Player } from "../../Player";

export class TopsoilContract implements IProjectCard {
    public cost: number = 8;
    public tags: Array<Tags> = [Tags.MICROBES, Tags.EARTH];
    public name: CardName = CardName.TOPSOIL_CONTRACT;
    public cardType: CardType = CardType.ACTIVE;

    public play(player: Player) {
        player.plants += 3;
        return undefined;
    }
}