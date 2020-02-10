import { Colony, IColony } from './Colony';
import { Player } from '../Player';
import { Resources } from '../Resources';
import { ColonyName } from './ColonyName';

export class Callisto extends Colony implements IColony {
    public name = ColonyName.CALLISTO;
    public trade(player: Player): void {
        player.energy += Math.max(2, (2 * this.trackPosition) -1 + Math.max( this.trackPosition - 4, 0) );
        this.afterTrade(this, player);
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