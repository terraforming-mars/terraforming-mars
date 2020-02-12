import { Colony, IColony } from './Colony';
import { Player } from '../Player';
import { Resources } from '../Resources';
import { ColonyName } from './ColonyName';
import { ResourceType } from '../ResourceType';
import { Game } from '../Game';

export class Titan extends Colony implements IColony {
    public name = ColonyName.TITAN;
    public isActive = false;
    public resourceType = ResourceType.FLOATER;
    public trade(player: Player, game: Game): void {
        this.beforeTrade(this, player);
        player.plants += this.trackPosition;
        this.afterTrade(this, player, game);
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