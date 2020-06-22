import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { Game } from '../../Game';
import { CardName } from '../../CardName';

export class CuttingEdgeTechnology implements IProjectCard {
    public cost: number = 11;
    public tags: Array<Tags> = [Tags.SCIENCE];
    public name: CardName = CardName.CUTTING_EDGE_TECHNOLOGY;
    public cardType: CardType = CardType.ACTIVE;

    public play() {
        return undefined;
    }

    public getCardDiscount(_player: Player, _game: Game, card: IProjectCard) {
        if (card.canPlay && (card.hasRequirements === undefined || card.hasRequirements)) return 2;
        return 0;
    }

    public getVictoryPoints() {
        return 1;
    }
}    