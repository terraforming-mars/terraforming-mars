import { Player } from '../Player';
import { SelectSpace } from '../inputs/SelectSpace';
import { Game } from '../Game';

export interface IColony {
    isActive: boolean;
    isVisited: boolean;
    trackPosition: number;
    colonies: Array<Player>;
    trade: (player: Player) => void;
    onColonyPlaced: (player: Player, game?: Game) => undefined | SelectSpace;
    giveTradeBonus: (player: Player) => void;
}

export abstract class Colony  {
    public isActive: boolean = true;
    public isVisited: boolean = false;
    public colonies: Array<Player> = [];
    public trackPosition: number = 1;

    public endGeneration(): void {
        this.increaseTrack();
        this.isVisited = false;
    }
    public increaseTrack(): void {
        if (this.trackPosition < 6) this.trackPosition++;
    }
    public isColonyFull(): boolean {
        return this.colonies.length >= 3;
    }
    public afterTrade(colony: IColony): void {
        colony.trackPosition = this.colonies.length;
        colony.isVisited = true;
        colony.colonies.forEach(player => {
            colony.giveTradeBonus(player);
        });
    }
}    