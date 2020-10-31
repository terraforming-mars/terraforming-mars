import { Player, PlayerId } from "../Player";
import { Game } from "../Game";
import { IColony } from "../colonies/Colony";
import { DeferredAction } from "./DeferredAction";
import { Multiset } from "../utils/Multiset";

export class GiveTradeBonus implements DeferredAction {
    public cb: () => void = () => {};
    private waitingFor: Multiset<PlayerId> = new Multiset<PlayerId>();
    constructor(
        public player: Player,
        public game: Game,
        public colony: IColony
    ){}

    public execute() {
        if (this.colony.colonies.length === 0) {
            this.cb();
            return undefined;
        }

        for (const playerId of this.colony.colonies) {
            this.waitingFor.add(playerId);
        }

        for (const entry of this.waitingFor.entries()) {
            const playerId = entry[0];
            const player = this.game.getPlayerById(playerId);
            this.giveTradeBonus(player, this.game);
        }

        return undefined;
    }

    public giveTradeBonus(player: Player, game: Game): void {
        if (this.waitingFor.get(player.id) !== undefined && this.waitingFor.get(player.id)! > 0) {
            this.waitingFor.subtract(player.id);
            const input = this.colony.giveTradeBonus(player, game);
            if (input !== undefined) {
                player.setWaitingFor(input, () => this.giveTradeBonus(player, game));
            } else {
                this.giveTradeBonus(player, game);
            }
        } else {
            this.waitingFor.remove(player.id);
            this.doneGettingBonus();
        }
    }

    private doneGettingBonus(): void {
        if (this.waitingFor.entries().length === 0) {
            this.cb();
        }
    }
}
