
import { IAward } from "./IAward";
import { Player } from "../Player";
import { Game } from "../Game";
import { CardType } from "../cards/CardType";

export class Magnate implements IAward {
    public name: string = "Magnate";
    public description: string = "Most automated cards in play (green cards)"
    public getScore(player: Player, _game: Game): number {
        return player.playedCards
          .filter((card) => card.cardType === CardType.AUTOMATED).length
    }   
}