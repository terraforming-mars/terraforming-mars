import { Player, PlayerId } from "../Player";
import { Game } from "../Game";
import { IColony } from "../colonies/Colony";
import { DeferredAction } from "./DeferredAction";

export class GiveTradeBonus implements DeferredAction {
    public cb: () => void = () => {};
    private waitingFor: Record<PlayerId,number> = {};
    constructor(
        public player: Player,
        public game: Game,
        public colony: IColony
    ){}

    public execute() {
        for (let playerId of this.colony.colonies) {
            this.waitingFor[playerId] = this.waitingFor[playerId] + 1 || 1;
        }

        for (let playerId in this.waitingFor) {
            const player = this.game.getPlayerById(playerId);
            this.giveTradeBonus(player, this.game);
        }

        return undefined;
    }

    public giveTradeBonus(player: Player, game: Game): void {
        if (this.waitingFor[player.id] > 0) {
            this.waitingFor[player.id]--;
            const input = this.colony.giveTradeBonus(player, game);
            if (input !== undefined) {
                player.setWaitingFor(input, () => this.giveTradeBonus(player, game));
            } else {
                this.giveTradeBonus(player, game);
            }
        } else {
            delete this.waitingFor[player.id];
            this.doneGettingBonus();
        }
    }

    private doneGettingBonus(): void {
        if (Object.keys(this.waitingFor).length === 0) {
            this.cb();
        }
    }
}
