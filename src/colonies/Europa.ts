import { Colony, IColony } from './Colony';
import { Player } from '../Player';
import { Resources } from '../Resources';
import { Game } from '../Game';
import { ColonyName } from './ColonyName';
import { LogHelper } from '../components/LogHelper';

export class Europa extends Colony implements IColony {
    public name = ColonyName.EUROPA;
    public description: string = "Production";
    public trade(player: Player, game: Game): void {
        this.beforeTrade(this, player);
        if (this.trackPosition < 2) {
            player.setProduction(Resources.MEGACREDITS);
            LogHelper.logGainProduction(game, player, Resources.MEGACREDITS);
        } else if (this.trackPosition < 4) {
            player.setProduction(Resources.ENERGY);
            LogHelper.logGainProduction(game, player, Resources.ENERGY);
        } else {
            player.setProduction(Resources.PLANTS);
            LogHelper.logGainProduction(game, player, Resources.PLANTS);
        }
        this.afterTrade(this, player, game);
    }
    public onColonyPlaced(player: Player, game: Game): undefined {
        super.addColony(this, player, game);
        game.addOceanInterrupt(player, 'Select ocean for Europa colony')
        return undefined;
    }
    public giveTradeBonus(player: Player): void {
        player.megaCredits++;
    }    
}