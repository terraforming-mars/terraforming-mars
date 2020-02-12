import { Colony, IColony } from './Colony';
import { Player } from '../Player';
import { ColonyName } from './ColonyName';
import { Resources } from '../Resources';
import { Game } from '../Game';

export class Luna extends Colony implements IColony {
    public name = ColonyName.LUNA;
    public trade(player: Player, game: Game): void {
        this.beforeTrade(this, player);
        player.megaCredits += this.trackPosition * 2 + Math.max(this.trackPosition - 2, 0) + Math.max(this.trackPosition - 5, 0); 
        this.afterTrade(this, player, game);
    }
    public onColonyPlaced(player: Player): undefined {
        super.addColony(this, player);
        player.setProduction(Resources.MEGACREDITS, 2);
        return undefined;
    }
    public giveTradeBonus(player: Player): void {
        player.megaCredits += 2;
    }    
}