import { Colony, IColony } from './Colony';
import { Player } from '../Player';
import { Resources } from '../Resources';
import { ColonyName } from './ColonyName';
import { Game } from '../Game';
import { LogHelper } from '../components/LogHelper';

export class Callisto extends Colony implements IColony {
    public name = ColonyName.CALLISTO;
    public description: string = "Energy";
    public trade(player: Player, game: Game): void {
        this.beforeTrade(this, player);
        const qty = Math.max(2, (2 * this.trackPosition) -1 + Math.max(this.trackPosition - 4, 0));
        player.energy += qty;
        LogHelper.logGainStandardResource(game, player, Resources.ENERGY, qty);
        this.afterTrade(this, player, game);
    }
    public onColonyPlaced(player: Player, game: Game): undefined {
        super.addColony(this, player, game);
        player.setProduction(Resources.ENERGY);
        return undefined;
    }
    public giveTradeBonus(player: Player): void {
        player.energy += 3;
    }    
}