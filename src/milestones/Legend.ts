import { IMilestone } from "./IMilestone";
import { Player } from "../Player";
import { Game } from "../Game";
import { CardType } from '../cards/CardType';

export class Legend implements IMilestone {
    public name: string = "Legend";
    public description: string = "Requires that you have played 5 events"
    public canClaim(player: Player, _game: Game): boolean {
        return player.playedCards
          .filter((card) => card.cardType === CardType.EVENT).length > 4;
    }   
}