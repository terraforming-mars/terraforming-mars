import { Colony, IColony } from './Colony';
import { Player } from '../Player';
import { Resources } from '../Resources';
import { ColonyName } from './ColonyName';

export class Ganymede extends Colony implements IColony {
    public name = ColonyName.GANYMEDE;
    public trade(player: Player): void {
        player.plants += this.trackPosition;
        this.afterTrade(this);
    }
    public onColonyPlaced(player: Player): undefined {
        super.addColony(this, player);
        player.setProduction(Resources.PLANTS);
        return undefined;
    }
    public giveTradeBonus(player: Player): void {
        player.plants++;
    }    
}