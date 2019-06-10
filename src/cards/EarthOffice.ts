
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class EarthOffice implements IProjectCard {
    public cost: number = 1;
    public tags: Array<Tags> = [Tags.EARTH];
    public name: string = "Earth Office";
    public cardType: CardType = CardType.ACTIVE;
    public text: string = "When you play an earth tag, you pay 3 mega credit less for it.";
    public description: string = "Coordinating deliveries and homeworld support.";
    public canPlay(): boolean {
        return true;
    }
    public getCardDiscount(_player: Player, _game: Game, card: IProjectCard) {
        if (card.tags.indexOf(Tags.EARTH) !== -1) {
            return 3;
        }
        return 0;
    }
    public play() {
        return undefined;
    }
}
