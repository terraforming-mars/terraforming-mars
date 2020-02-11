import { Colony, IColony } from './Colony';
import { Player } from '../Player';
import { ColonyName } from './ColonyName';
import { Resources } from '../Resources';

export class Ceres extends Colony implements IColony {
    public name = ColonyName.CERES;
    public trade(player: Player): void {
        if (this.trackPosition = 2) {
            player.steel += 3;
        } else {
            player.steel += Math.max(this.trackPosition * 2  - 2, 2);
        }    
        this.afterTrade(this, player);
    }
    public onColonyPlaced(player: Player): undefined {
        super.addColony(this, player);
        player.setProduction(Resources.STEEL);
        return undefined;
    }
    public giveTradeBonus(player: Player): void {
        player.steel += 2;
    }    
}