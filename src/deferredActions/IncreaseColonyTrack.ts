import { Game } from "../Game";
import { Player } from "../Player";
import { Colony, IColony } from "../colonies/Colony";
import { OrOptions } from "../inputs/OrOptions";
import { SelectOption } from "../inputs/SelectOption";
import { DeferredAction } from "./DeferredAction";
import { MAX_COLONY_TRACK_POSITION } from "../constants";

export class IncreaseColonyTrack implements DeferredAction {
    constructor(
        public player: Player,
        public game: Game,
        public colony: Colony & IColony,
        public cb: () => void
    ){}

    public execute() {
        if (this.player.colonyTradeOffset === 0) {
            this.cb();
            return undefined;
        }

        const maxSteps = Math.min(this.player.colonyTradeOffset, MAX_COLONY_TRACK_POSITION - this.colony.trackPosition);

        if (maxSteps <= 0) {
            this.cb();
            return undefined;
        }

        const options = new OrOptions();
        for (let steps = maxSteps; steps > 0; steps--) {
            options.options.push(
                new SelectOption("Increase colony track " + steps + " step(s)", "Confirm", () => {
                    this.colony.beforeTrade(this.colony, this.player, this.game, steps);
                    this.cb();
                    return undefined;
                })
            );
        }
        options.options.push(
            new SelectOption("Don't increase colony track", "Confirm", () => {
                this.cb();
                return undefined;
            })
        );

        return options;
    }
}
