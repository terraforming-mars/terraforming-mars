
import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { CardName } from '../../CardName';

export class SFMemorial implements IProjectCard {
    public cost: number = 7;
    public tags: Array<Tags> = [Tags.STEEL];
    public name: CardName = CardName.SF_MEMORIAL;
    public cardType: CardType = CardType.AUTOMATED;

    public play(player: Player, game: Game) {
        player.cardsInHand.push(game.dealer.dealCard());
        return undefined;
    }
    public getVictoryPoints() {
        return 1;
    }
}
