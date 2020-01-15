import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { ResourceType } from "../../ResourceType";
import { Game } from '../../Game';

export class VenusWaystation implements IProjectCard {
    public cost: number = 9;
    public tags: Array<Tags> = [Tags.VENUS, Tags.SPACE];
    public name: string = "Venus Waystation";
    public cardType: CardType = CardType.ACTIVE;
    public resourceType: ResourceType = ResourceType.MICROBE;
    public canPlay(): boolean {
        return true;
    }
    public play() {
        return undefined;
    }
    public getCardDiscount(_player: Player, _game: Game, card: IProjectCard) {
        if (card.tags.indexOf(Tags.VENUS) !== -1) {
            return 2;
        }
        return 0;
    }
    public getVictoryPoints() {
        return 1;
    }
}    