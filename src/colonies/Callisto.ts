import { Colony, IColony } from './Colony';
import { Player } from '../Player';
import { Resources } from '../Resources';
import { ColonyName } from './ColonyName';
import { Game } from '../Game';

export class Callisto extends Colony implements IColony {
    public name = ColonyName.CALLISTO;
    public trade(player: Player, game: Game): void {
        this.beforeTrade(this, player);
        player.energy += Math.max(2, (2 * this.trackPosition) -1 + Math.max( this.trackPosition - 4, 0) );
        this.afterTrade(this, player, game);
    }
    public onColonyPlaced(player: Player): undefined {
        super.addColony(this, player);
        player.setProduction(Resources.ENERGY);
        return undefined;
    }
    public giveTradeBonus(player: Player): void {
        player.energy += 3;
    }    
}