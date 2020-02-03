import { IMilestone } from "./IMilestone";
import { Player } from "../Player";
import { Game } from "../Game";
import { CardType } from '../cards/CardType';

export class Tactitian implements IMilestone {
    public name: string = "Tactitian";
    public description: string = "Requires that you have 5 cards with requirements in play"
    public canClaim(player: Player, _game: Game): boolean {
        return player.playedCards.filter((card) => card.canPlay.arguments.length > 0 && card.cardType !== CardType.PRELUDE).length >= 5;
    }   
}