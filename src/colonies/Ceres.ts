import { Colony, IColony } from './Colony';
import { Player } from '../Player';
import { ColonyName } from './ColonyName';
import { Resources } from '../Resources';
import { Game } from '../Game';

export class Ceres extends Colony implements IColony {
    public name = ColonyName.CERES;
    public description: string = "Steel";
    public trade(player: Player, game: Game): void {
        this.beforeTrade(this, player);
        if (this.trackPosition = 2) {
            player.steel += 3;
        } else {
            player.steel += Math.max(this.trackPosition * 2  - 2, 2);
        }    
        this.afterTrade(this, player, game);
    }
    public onColonyPlaced(player: Player, game: Game): undefined {
        super.addColony(this, player, game);
        player.setProduction(Resources.STEEL);
        return undefined;
    }
    public giveTradeBonus(player: Player): void {
        player.steel += 2;
    }    
}