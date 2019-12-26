
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { Player } from "../Player";
import { Game } from "../Game";
import { CardType } from "./CardType";

export class SpaceStation implements IProjectCard {
    public cost: number = 10;
    public tags: Array<Tags> = [Tags.SPACE];
    public name: string = "Space Station";
    public cardType: CardType = CardType.ACTIVE;
    public canPlay(): boolean {
        return true;
    }
    public getCardDiscount(_player: Player, _game: Game, card: IProjectCard) {
        if (card.tags.indexOf(Tags.SPACE) !== -1) {
            return 2;
        }
        return 0;
    }
    public play() {
        return undefined;
    }
    public getVictoryPoints() {
        return 1;
    }
}
    
