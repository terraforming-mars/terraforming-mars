import { Game } from "../Game";
import { Player } from "../Player";
import { Resources } from "../Resources";
import { OrOptions } from "../inputs/OrOptions";
import { SelectOption } from "../inputs/SelectOption";
import { DeferredAction } from "./DeferredAction";

export class RemoveAnyPlants implements DeferredAction {
    constructor(
        public player: Player,
        public game: Game,
        public count: number = 1,
        public title: string = "Select player to remove up to " + count + " plants"
    ){}

    public execute() {
        if (this.game.isSoloMode()) {
            // Crash site cleanup hook
            this.game.someoneHasRemovedOtherPlayersPlants = true;
            return undefined;
        }

        const candidates = this.game.getPlayers().filter((p) => p.id !== this.player.id && !p.plantsAreProtected() && p.getResource(Resources.PLANTS) > 0);

        if (candidates.length === 0) {
            return undefined;
        }

        const removalOptions = candidates.map((candidate) => {
            const qtyToRemove = Math.min(candidate.plants, this.count);
            return new SelectOption("Remove " + qtyToRemove + " plants from " + candidate.name, "Remove plants", () => {
                candidate.setResource(Resources.PLANTS, -qtyToRemove, this.game, this.player);
                return undefined;
            })
        });

        return new OrOptions(
            ...removalOptions,
            new SelectOption("Skip removing plants", "Confirm", () => { return undefined; })
        );
    }
}
