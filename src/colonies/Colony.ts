import { Player, PlayerId } from "../Player";
import { PlayerInput } from "../PlayerInput";
import { SelectSpace } from "../inputs/SelectSpace";
import { SerializedColony } from "../SerializedColony";
import { Game } from "../Game";
import { Resources } from "../Resources";
import { LogHelper } from "../components/LogHelper";
import { MAX_COLONY_TRACK_POSITION } from "../constants";
import { CardName } from "../CardName";
import { GiveTradeBonus } from "../deferredActions/GiveTradeBonus";

export interface IColony extends SerializedColony {
    trade: (player: Player, game: Game, usesTradeFleet?: boolean) => void;
    onColonyPlaced: (player: Player, game: Game) => undefined | SelectSpace;
    giveTradeBonus: (player: Player, game: Game) => undefined | PlayerInput;
    endGeneration: () => void;
    increaseTrack(value?: number): void;
    decreaseTrack(value?: number): void;
}

export abstract class Colony {
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

    public beforeTrade(colony: IColony, player: Player, game: Game, steps?: number): void {
        if (steps === undefined) {
            steps = player.colonyTradeOffset;
        }
        steps = Math.min(steps, MAX_COLONY_TRACK_POSITION - colony.trackPosition);
        if (steps <= 0) {
            return;
        }

        LogHelper.logColonyTrackIncrease(game, player, colony, steps);
        colony.increaseTrack(steps);
    }

    public afterTrade(colony: IColony, player: Player, game: Game): void {
        colony.trackPosition = this.colonies.length;
        colony.visitor = player.id;
        player.tradesThisTurn++;
        if (colony.colonies.length > 0) {
            // Special deferred action that gets triggered for all players at the same time
            game.defer(new GiveTradeBonus(player, game, colony));
        }
    }
    public addColony(colony: IColony, player: Player, game: Game): void {
        colony.colonies.push(player.id);
        if (colony.trackPosition < colony.colonies.length) {
            colony.trackPosition = colony.colonies.length;
        }

        game.log("${0} built a colony on ${1}", b => b.player(player).colony(colony));

        // Poseidon hook
        let poseidon = game.getPlayers().filter(player => player.isCorporation(CardName.POSEIDON));
        if (poseidon.length > 0) {
          poseidon[0].addProduction(Resources.MEGACREDITS);
        }
    }  
}
