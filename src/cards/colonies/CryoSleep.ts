import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { CardName } from '../../CardName';

export class CryoSleep implements IProjectCard {
    public cost: number = 10;
    public tags: Array<Tags> = [Tags.SCIENCE];
    public name: CardName = CardName.CRYO_SLEEP;
    public cardType: CardType = CardType.ACTIVE;

    public play(player: Player) {
        player.colonyTradeDiscount++;
        return undefined;
    }

    public getVictoryPoints() {
        return 1;
    }
}