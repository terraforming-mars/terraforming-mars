import { Player } from '../Player';
import { SelectSpace } from '../inputs/SelectSpace';
import { Game } from '../Game';
import { ColonyName } from './ColonyName';
import { ResourceType } from '../ResourceType';
import { CorporationName } from '../CorporationName';
import { Resources } from '../Resources';
import { LogMessageType } from "../LogMessageType";
import { LogMessageData } from "../LogMessageData";
import { LogMessageDataType } from "../LogMessageDataType";

export interface IColony {
    name: ColonyName;
    description: string;
    isActive: boolean;
    visitor: undefined | Player;
    trackPosition: number;
    colonies: Array<Player>;
    resourceType?: ResourceType;
    trade: (player: Player, game: Game) => void;
    onColonyPlaced: (player: Player, game: Game) => undefined | SelectSpace;
    giveTradeBonus: (player: Player, game: Game) => void;
    endGeneration: () => void;
    increaseTrack(value?: number): void;
    decreaseTrack(value?: number): void;
}

export abstract class Colony  {
    public isActive: boolean = true;
    public visitor: undefined | Player = undefined;
    public colonies: Array<Player> = [];
    public trackPosition: number = 1;

    public endGeneration(): void {
        if (this.isActive) {
          this.increaseTrack();
        }
        this.visitor = undefined;
    }
    public increaseTrack(value?: number): void {
        if (value === undefined) {
            this.trackPosition++;
        } else {
            this.trackPosition += value;
        }    
        if (this.trackPosition > 6) this.trackPosition = 6;
    }

    public decreaseTrack(value?: number): void {
        if (value === undefined) {
            this.trackPosition--;
        } else {
            this.trackPosition -= value;
        }    
        if (this.trackPosition < this.colonies.length) this.trackPosition = this.colonies.length;
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
        colony.visitor = player;
        player.tradesThisTurn++;
        // Trigger current player interrupts first
        colony.colonies.filter(colonyPlayer => colonyPlayer === player).forEach(player => {
            colony.giveTradeBonus(player, game);
        });
        colony.colonies.filter(colonyPlayer => colonyPlayer !== player).forEach(player => {
            colony.giveTradeBonus(player, game);
        });
    }
    public addColony(colony: IColony, player: Player, game: Game): void {
        colony.colonies.push(player);
        if (colony.trackPosition < colony.colonies.length) {
            colony.trackPosition = colony.colonies.length;
        }

        game.log(
            LogMessageType.DEFAULT,
            "${0} built a colony on ${1}",
            new LogMessageData(LogMessageDataType.PLAYER, player.id),
            new LogMessageData(LogMessageDataType.COLONY, colony.name)
          );

        // Poseidon hook
        let poseidon = game.getPlayers().filter(player => player.isCorporation(CorporationName.POSEIDON));
        if (poseidon.length > 0) {
          poseidon[0].setProduction(Resources.MEGACREDITS);
        }
    }    
}    