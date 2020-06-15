import { IMilestone } from "./IMilestone";
import { Player } from "../Player";
import { Game } from "../Game";
import { CardType } from "../cards/CardType";

export class Tactician implements IMilestone {
    public name: string = "Tactician";
    public description: string = "Requires that you have 5 cards with requirements in play"
    public canClaim(player: Player, _game: Game): boolean {  
       return player.playedCards.filter((card) => card.cardType !== CardType.PRELUDE
          && card.canPlay !== undefined && (card.hasRequirements === undefined || card.hasRequirements)).length >=5;
    }   
}