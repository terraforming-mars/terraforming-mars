
import { Tags } from "./cards/Tags";
import { Application } from "./Application";
import { HowToPay } from "./HowToPay";

export class PlayerRoute {
    constructor(private application: Application) {
    }
    public playCard(gameId: string, playerId: string, cardName: string, howToPay: HowToPay): void {
        const game = this.application.getGameById(gameId);
        const player = game.getPlayerById(playerId);
        const card = player.getCard(cardName);
        // Can pay using steel
        if (card.tags.indexOf(Tags.STEEL) !== -1) {

        } else if (howToPay.steel > 0) {
            throw "Can not pay for this card with steel";
        }

        // Can pay using titanium
        if (card.tags.indexOf(Tags.SPACE) !== -1) {
            
        } else if (howToPay.titanium > 0) {
            throw "Can not pay for this card with titanium";
        }
    }
}
