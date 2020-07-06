import { Colony, IColony } from './Colony';
import { Player } from '../Player';
import { ColonyName } from './ColonyName';
import { Game } from '../Game';
import { LogHelper } from '../components/LogHelper';
import { Resources } from '../Resources';

export class Triton extends Colony implements IColony {
    public name = ColonyName.TRITON;
    public description: string = "Titanium";
    public trade(player: Player, game: Game): void {
        this.beforeTrade(this, player);
        const qty = Math.max(this.trackPosition - 1, 1);
        player.titanium += qty;
        LogHelper.logGainStandardResource(game, player, Resources.TITANIUM, qty);
        this.afterTrade(this, player, game);
    }
    public onColonyPlaced(player: Player, game: Game): undefined {
        super.addColony(this, player, game);
        player.titanium += 3;
        return undefined;
    }
    public giveTradeBonus(player: Player): void {
        player.titanium++;
    }    
}