import { Colony, IColony } from './Colony';
import { Player } from '../Player';
import { Resources } from '../Resources';

export class Ganymede extends Colony implements IColony {
    public trade(player: Player): void {
        player.plants += this.trackPosition;
        this.afterTrade(this);
    }
    public onColonyPlaced(player: Player): undefined {
        this.colonies.push(player);
        player.setProduction(Resources.PLANTS);
        return undefined;
    }
    public giveTradeBonus(player: Player): void {
        player.plants++;
    }    
}