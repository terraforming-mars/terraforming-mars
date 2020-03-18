import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { CardName } from '../../CardName';

export class AtalantaPlanitiaLab implements IProjectCard {
    public cost: number = 10;
    public tags: Array<Tags> = [Tags.VENUS, Tags.SCIENCE];
    public name: CardName = CardName.ATALANTA_PLANITIA_LAB;
    public cardType: CardType = CardType.AUTOMATED;
    public canPlay(player: Player): boolean {
        return player.getTagCount(Tags.SCIENCE) >= 3;
    }
    public play(player: Player, game: Game) {
        player.cardsInHand.push(game.dealer.dealCard());
        player.cardsInHand.push(game.dealer.dealCard());
        return undefined;
    }

    public getVictoryPoints() {
        return 2;
    }
}