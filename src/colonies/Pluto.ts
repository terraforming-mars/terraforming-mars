import { Colony, IColony } from './Colony';
import { Player } from '../Player';
import { ColonyName } from './ColonyName';
import { Game } from '../Game';

export class Pluto extends Colony implements IColony {
    public name = ColonyName.PLUTO;
    public trade(player: Player, game: Game): void {
        let extraCards: number = 0;
        this.beforeTrade(this, player);
        if (this.trackPosition === 2) {
            extraCards = 2;
        } else if (this.trackPosition < 5) {
            extraCards = Math.max(this.trackPosition - 1, 1);
        } else {
            extraCards = this.trackPosition - 2;
        }
        for (let i = 0; i < extraCards; i++) {
            player.cardsInHand.push(game.dealer.dealCard());
        }
        this.afterTrade(this, player, game);
    }
    public onColonyPlaced(player: Player, game: Game): undefined {
        super.addColony(this, player);
        player.cardsInHand.push(game.dealer.dealCard());
        player.cardsInHand.push(game.dealer.dealCard());
        return undefined;
    }
    public giveTradeBonus(player: Player, game: Game): void {
        player.cardsInHand.push(game.dealer.dealCard());
        player.discardCardSelector(game);
    }    
}