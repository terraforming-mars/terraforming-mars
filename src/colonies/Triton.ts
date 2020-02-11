import { Colony, IColony } from './Colony';
import { Player } from '../Player';
import { ColonyName } from './ColonyName';

export class Triton extends Colony implements IColony {
    public name = ColonyName.TRITON;
    public trade(player: Player): void {
        player.titanium += Math.max(this.trackPosition - 1, 1);
        this.afterTrade(this, player);
    }
    public onColonyPlaced(player: Player): undefined {
        super.addColony(this, player);
        player.titanium += 3;
        return undefined;
    }
    public giveTradeBonus(player: Player): void {
        player.titanium++;
    }    
}