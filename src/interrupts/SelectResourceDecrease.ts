import { Game } from "../Game";
import { PlayerInput } from "../PlayerInput";
import { Player } from "../Player";
import { PlayerInterrupt } from "./PlayerInterrupt";
import { Resources } from "../Resources";
import { SelectPlayer } from "../inputs/SelectPlayer";
import { OrOptions } from "../inputs/OrOptions";
import { SelectOption } from "../inputs/SelectOption";

export class SelectResourceDecrease implements PlayerInterrupt {
    public playerInput?: PlayerInput;
    constructor(
        public player: Player,
        public game: Game,
        public resource: Resources,
        public count: number = 1,
        public title: string = "Select player to remove up to " + count + " " + resource
    ){}

    public generatePlayerInput() {
        let candidates: Array<Player> = [];
        if (this.resource === Resources.PLANTS) {
            candidates = this.game.getPlayers().filter((p) => p.id !== this.player.id && !p.plantsAreProtected() && p.getResource(this.resource) > 0);
        } else {
            candidates = this.game.getPlayers().filter((p) => p.id !== this.player.id && p.getResource(this.resource) > 0);
        }

        if (candidates.length === 0) {
            this.playerInput = undefined;
            return;
        } else if (candidates.length === 1) {
            const qtyToRemove = Math.min(candidates[0].plants, this.count);
            if (this.resource === Resources.PLANTS) {
                this.playerInput = new OrOptions(
                    new SelectOption("Remove " + qtyToRemove + " plants from " + candidates[0].name, "Remove plants", () => {
                        candidates[0].setResource(this.resource, -qtyToRemove, this.game, this.player);
                        return undefined;
                    }),
                    new SelectOption("Skip removing plants", "Confirm", () => {
                        return undefined;
                    })
                );
                return;
            } else {
                candidates[0].setResource(this.resource, -qtyToRemove, this.game, this.player);
                this.playerInput = undefined;
                return;
            }
        } else {
            if (this.resource === Resources.PLANTS) {
                const removalOptions = candidates.map((candidate) => {
                    const qtyToRemove = Math.min(candidate.plants, this.count);
                    return new SelectOption("Remove " + qtyToRemove + " plants from " + candidate.name, "Remove plants", () => {
                        candidate.setResource(this.resource, -qtyToRemove, this.game, this.player);
                        return undefined;
                    })
                });

                this.playerInput = new OrOptions(
                    ...removalOptions,
                    new SelectOption("Skip removing plants", "Confirm", () => { return undefined; })
                );
                return;
            } else {
                this.playerInput = new SelectPlayer(
                    candidates,
                    this.title,
                    "Remove",
                    (found: Player) => {
                        found.setResource(this.resource, -this.count, this.game, this.player);
                        return undefined;
                    }
                );
            }
        }
    }
}
