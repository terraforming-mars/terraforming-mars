
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { Player } from "../Player";
import { Game } from "../Game";
import { CardType } from "./CardType";
import { CardName } from '../CardName';

export class SpaceStation implements IProjectCard {
    public cost: number = 10;
    public tags: Array<Tags> = [Tags.SPACE];
    public name: CardName = CardName.SPACE_STATION;
    public cardType: CardType = CardType.ACTIVE;

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
    
