import { Colony, IColony } from './Colony';
import { Player } from '../Player';
import { ColonyName } from './ColonyName';
import { ResourceType } from '../ResourceType';
import { Game } from '../Game';

export class Titan extends Colony implements IColony {
    public name = ColonyName.TITAN;
    public description: string = "Floaters";
    public isActive = false;
    public resourceType = ResourceType.FLOATER;
    public trade(player: Player, game: Game): void {
        this.beforeTrade(this, player);
        let floaters: number = 0;
        if (this.trackPosition < 5) {
            floaters = Math.max(this.trackPosition - 1, 1);
        } else {
            floaters = this.trackPosition - 2;
        }
        player.addResourceToSelector(ResourceType.FLOATER, floaters, game);
        this.afterTrade(this, player, game);
    }
    public onColonyPlaced(player: Player, game: Game): undefined {
        super.addColony(this, player, game);
        player.addResourceToSelector(ResourceType.FLOATER, 3, game);
        return undefined;
    }
    public giveTradeBonus(player: Player, game: Game): void {
        player.addResourceToSelector(ResourceType.FLOATER, 1, game);
    }    
}