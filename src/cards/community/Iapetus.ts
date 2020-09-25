import { Colony, IColony } from '../../colonies/Colony';
import { Player } from '../../Player';
import { Game } from '../../Game';
import { ColonyName } from '../../colonies/ColonyName';
import { MAX_COLONY_TRACK_POSITION } from '../../constants';

export class Iapetus extends Colony implements IColony {
    public name = ColonyName.IAPETUS;
    public description: string = "TR";

    public trade(player: Player, game: Game, usesTradeFleet: boolean = true): void {
        if (usesTradeFleet) this.beforeTrade(this, player, game);
        let qty : number = 0;

        if (this.trackPosition === MAX_COLONY_TRACK_POSITION) {
            qty = 16;
        } else if (this.trackPosition === MAX_COLONY_TRACK_POSITION - 1) {
            qty = 12;
        } else if (this.trackPosition >= 1) {
            qty = Math.pow(2, this.trackPosition - 1);
        }

        player.megaCredits += qty;
        if (usesTradeFleet) this.afterTrade(this, player, game);
    }

    public onColonyPlaced(player: Player, game: Game): undefined {
        super.addColony(this, player, game);
        player.increaseTerraformRating(game);
        return undefined;
    }
    
    public giveTradeBonus(player: Player): void {
        player.cardDiscount += 1;
    }   
}