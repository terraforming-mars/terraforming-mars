import { IMilestone } from "./IMilestone";
import { Player } from "../Player";
import { Game } from "../Game";
import { CardType } from '../cards/CardType';

export class Tactician implements IMilestone {
    public name: string = "Tactician";
    public description: string = "Requires that you have 5 cards with requirements in play"
    private excludedCardTypes = [CardType.PRELUDE, CardType.EVENT];

    public canClaim(player: Player, _game: Game): boolean {
        const validCards = player.playedCards.filter((card) => {
            const isValidCardType = !this.excludedCardTypes.includes(card.cardType);
            const hasRequirements = card.canPlay && (card.hasRequirements === undefined || card.hasRequirements);

            return isValidCardType && hasRequirements;
        });

       return validCards.length >= 5;
    }
}