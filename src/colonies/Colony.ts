import { Player, PlayerId } from "../Player";
import { SelectSpace } from '../inputs/SelectSpace';
import { Game } from '../Game';
import { ColonyName } from './ColonyName';
import { ResourceType } from '../ResourceType';
import { CorporationName } from '../CorporationName';
import { Resources } from '../Resources';
import { LogHelper } from "../components/LogHelper";
import { MAX_COLONY_TRACK_POSITION } from "../constants";

export interface IColony {
    name: ColonyName;
    description: string;
    isActive: boolean;
    visitor: undefined | PlayerId;
    trackPosition: number;
    colonies: Array<PlayerId>;
    resourceType?: ResourceType;
    trade: (player: Player, game: Game, usesTradeFleet?: boolean) => void;
    onColonyPlaced: (player: Player, game: Game) => undefined | SelectSpace;
    giveTradeBonus: (player: Player, game: Game) => void;
    endGeneration: () => void;
    increaseTrack(value?: number): void;
    decreaseTrack(value?: number): void;
}

export abstract class Colony  {
    public isActive: boolean = true;
    public visitor: undefined | PlayerId = undefined;
    public colonies: Array<PlayerId> = [];
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
        if (this.trackPosition > MAX_COLONY_TRACK_POSITION) this.trackPosition = MAX_COLONY_TRACK_POSITION;
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

    public beforeTrade(colony: IColony, player: Player, game: Game): void {
        if (player.colonyTradeOffset > 0) {
            LogHelper.logColonyTrackIncrease(game, player, colony);
            colony.increaseTrack(player.colonyTradeOffset);
        }
    }    

    public afterTrade(colony: IColony, player: Player, game: Game): void {
        colony.trackPosition = this.colonies.length;
        colony.visitor = player.id;
        player.tradesThisTurn++;
        // Trigger current player interrupts first
        colony.colonies.filter(colonyPlayerId => colonyPlayerId === player.id).forEach(playerId => {
            colony.giveTradeBonus(game.getPlayerById(playerId), game);
        });
        colony.colonies.filter(colonyPlayerId => colonyPlayerId !== player.id).forEach(playerId => {
            colony.giveTradeBonus(game.getPlayerById(playerId), game);
        });
    }
    public addColony(colony: IColony, player: Player, game: Game): void {
        colony.colonies.push(player.id);
        if (colony.trackPosition < colony.colonies.length) {
            colony.trackPosition = colony.colonies.length;
        }

        game.log("${0} built a colony on ${1}", b => b.player(player).colony(colony));

        // Poseidon hook
        let poseidon = game.getPlayers().filter(player => player.isCorporation(CorporationName.POSEIDON));
        if (poseidon.length > 0) {
          poseidon[0].setProduction(Resources.MEGACREDITS);
        }
    }    
}    