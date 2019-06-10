
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";

export class EarthCatapult implements IProjectCard {
    public cost: number = 23;
    public tags: Array<Tags> = [Tags.EARTH];
    public name: string = "Earth Catapult";
    public text: string = "When you play a card, you pay 2 mega credits less for it. Gain 2 victory points.";
    public cardType: CardType = CardType.ACTIVE;
    public description: string = "When export from Earth becomes easier, everything gets cheaper.";
    public canPlay(): boolean {
        return true;
    }
    public getCardDiscount() {
        return 2;
    }
    public play(player: Player) {
        player.victoryPoints += 2;
        return undefined;
    }
}
