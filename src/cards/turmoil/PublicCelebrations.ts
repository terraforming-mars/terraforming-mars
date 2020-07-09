import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardName } from "../../CardName";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { Game } from '../../Game';

export class PublicCelebrations implements IProjectCard {
    public cost: number = 8;
    public tags: Array<Tags> = [];
    public name: CardName = CardName.PUBLIC_CELEBRATIONS;
    public cardType: CardType = CardType.EVENT;

    public canPlay(player: Player, game: Game): boolean {
        if (game.turmoil !== undefined) {
            return game.turmoil.chairman === player.id;
        }
        return false;
    }

    public play() {
        return undefined;
    }

    public getVictoryPoints() {
        return 2;
    }
}