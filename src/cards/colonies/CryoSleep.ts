import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { CardName } from "../../CardName";

export class CryoSleep implements IProjectCard {
    public cost = 10;
    public tags = [Tags.SCIENCE];
    public name = CardName.CRYO_SLEEP;
    public cardType = CardType.ACTIVE;

    public play(player: Player) {
        player.colonyTradeDiscount++;
        return undefined;
    }

    public getVictoryPoints() {
        return 1;
    }
}