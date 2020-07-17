import { Colony, IColony } from './Colony';
import { Player } from '../Player';
import { ColonyName } from './ColonyName';
import { Game } from '../Game';
import { SelectDiscard } from '../interrupts/SelectDiscard';
import { LogHelper } from '../components/LogHelper';

export class Pluto extends Colony implements IColony {
    public name = ColonyName.PLUTO;
    public description: string = "Cards";
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
        LogHelper.logCardChange(game, player, "drew", extraCards);
        this.afterTrade(this, player, game);
    }
    public onColonyPlaced(player: Player, game: Game): undefined {
        super.addColony(this, player, game);
        player.cardsInHand.push(game.dealer.dealCard());
        player.cardsInHand.push(game.dealer.dealCard());
        return undefined;
    }
    public giveTradeBonus(player: Player, game: Game): void {
        game.addInterrupt(new SelectDiscard(player, game, 'Pluto colony bonus. Select a card to discard', true));
    }    
}