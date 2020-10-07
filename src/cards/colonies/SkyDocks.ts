import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { CardName } from '../../CardName';
import { MAX_FLEET_SIZE } from "../../constants";

export class SkyDocks implements IProjectCard {
    public cost: number = 18;
    public tags: Array<Tags> = [Tags.SPACE, Tags.EARTH];
    public name: CardName = CardName.SKY_DOCKS;
    public cardType: CardType = CardType.ACTIVE;

    public canPlay(player: Player): boolean {
        return player.getTagCount(Tags.EARTH) >= 2;
    }

    public play(player: Player) {
        if (player.fleetSize < MAX_FLEET_SIZE) player.fleetSize++;
        return undefined;
    }

    public getCardDiscount() {
        return 1;
    }

    public getVictoryPoints() {
        return 2;
    }
}
