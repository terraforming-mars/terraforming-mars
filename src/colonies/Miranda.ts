import { Colony, IColony } from './Colony';
import { Player } from '../Player';
import { ColonyName } from './ColonyName';
import { Game } from '../Game';
import { ResourceType } from '../ResourceType';

export class Miranda extends Colony implements IColony {
    public name = ColonyName.MIRANDA;
    public description: string = "Animals";
    public isActive = false;
    public resourceType = ResourceType.ANIMAL;
    public trade(player: Player, game: Game, usesTradeFleet: boolean = true): void {
        if (usesTradeFleet) this.beforeTrade(this, player, game);

        let animals: number = 0;
        if (this.trackPosition < 3) {
            animals = 1;
        } else if (this.trackPosition < 5) {
            animals = 2;
        } else {
            animals = 3;
        }

        game.addResourceInterrupt(player, ResourceType.ANIMAL, animals, undefined);
        if (usesTradeFleet) this.afterTrade(this, player, game);
    }
    public onColonyPlaced(player: Player, game: Game): undefined {
        super.addColony(this, player, game);
        game.addResourceInterrupt(player, ResourceType.ANIMAL, 1, undefined);
        return undefined;
    }
    public giveTradeBonus(player: Player, game: Game): void {
        player.cardsInHand.push(
            game.dealer.dealCard());
    }    
}