import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardName } from "../../CardName";
import { CardType } from "../CardType";
import { Player } from "../../Player";

export class TopsoilContract implements IProjectCard {
    public cost = 8;
    public tags = [Tags.MICROBES, Tags.EARTH];
    public name = CardName.TOPSOIL_CONTRACT;
    public cardType = CardType.ACTIVE;

    public play(player: Player) {
        player.plants += 3;
        return undefined;
    }
}