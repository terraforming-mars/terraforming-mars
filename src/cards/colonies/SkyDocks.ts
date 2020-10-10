import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { CardName } from '../../CardName';

export class SkyDocks implements IProjectCard {
    public cost: number = 18;
    public tags: Array<Tags> = [Tags.SPACE, Tags.EARTH];
    public name: CardName = CardName.SKY_DOCKS;
    public cardType: CardType = CardType.ACTIVE;

    public canPlay(player: Player): boolean {
        return player.getTagCount(Tags.EARTH) >= 2;
    }

    public play(player: Player) {
        player.increaseFleetSize();
        return undefined;
    }

    public getCardDiscount() {
        return 1;
    }

    public getVictoryPoints() {
        return 2;
    }
}
