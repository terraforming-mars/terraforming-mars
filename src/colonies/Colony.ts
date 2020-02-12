import { Player } from '../Player';
import { SelectSpace } from '../inputs/SelectSpace';
import { Game } from '../Game';
import { ColonyName } from './ColonyName';
import { ResourceType } from '../ResourceType';

export interface IColony {
    name: ColonyName;
    isActive: boolean;
    isVisited: undefined | Player;
    trackPosition: number;
    colonies: Array<Player>;
    resourceType?: ResourceType;
    trade: (player: Player, game: Game) => void;
    onColonyPlaced: (player: Player, game: Game) => undefined | SelectSpace;
    giveTradeBonus: (player: Player, game: Game) => void;
    endGeneration: () => void;
    increaseTrack(value?: number): void;
}

export abstract class Colony  {
    public isActive: boolean = true;
    public isVisited: undefined | Player = undefined;
    public colonies: Array<Player> = [];
    public trackPosition: number = 1;

    public endGeneration(): void {
        if (this.isActive) {
          this.increaseTrack();
        }
        this.isVisited = undefined;
    }
    public increaseTrack(value?: number): void {
        if (value === undefined) {
            this.trackPosition++;
        } else {
            this.trackPosition += value;
        }    
        if (this.trackPosition > 6) this.trackPosition = 6;
    }
    public isColonyFull(): boolean {
        return this.colonies.length >= 3;
    }

    public beforeTrade(colony: IColony, player: Player): void {
        if (player.colonyTradeOffset > 0) {
            colony.increaseTrack(player.colonyTradeOffset);
        }
    }    


    public afterTrade(colony: IColony, player: Player, game: Game): void {
        colony.trackPosition = this.colonies.length;
        colony.isVisited = player;
        colony.colonies.forEach(player => {
            colony.giveTradeBonus(player, game);
        });
    }
    public addColony(colony: IColony, player: Player): void {
        colony.colonies.push(player);
        if (colony.trackPosition < colony.colonies.length) {
            colony.trackPosition = colony.colonies.length;
        }
    }    
}    