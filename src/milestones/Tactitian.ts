import { IMilestone } from "./IMilestone";
import { Player } from "../Player";
import { Game } from "../Game";
import { CardType } from '../cards/CardType';
import { HTML_DATA } from '../HTML_data';

export class Tactitian implements IMilestone {
    public name: string = "Tactitian";
    public description: string = "Requires that you have 5 cards with requirements in play"
    public canClaim(player: Player, _game: Game): boolean {   
       let score: number = 0; 
       player.playedCards.filter((card) => card.cardType !== CardType.PRELUDE).forEach((card) => {
         let htmlData = HTML_DATA.get(card.name);
         if (htmlData !== undefined && htmlData.includes('class="requirements')) {
           score++;
         }
       });
       return score >= 5;
    }   
}