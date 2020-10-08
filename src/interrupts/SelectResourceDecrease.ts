
import { Game } from "../Game";
import { OrOptions } from "../inputs/OrOptions";
import { PlayerInput } from "../PlayerInput";
import { Player } from "../Player";
import { PlayerInterrupt } from "./PlayerInterrupt";
import { Resources } from "../Resources";
import { SelectOption } from "../inputs/SelectOption"
import { SelectPlayer } from "../inputs/SelectPlayer";

export class SelectResourceDecrease implements PlayerInterrupt {
    public playerInput: PlayerInput | undefined;
    constructor(
        public player: Player,
        public candidates: Array<Player>,
        public game: Game,
        public resource: Resources,
        public count: number = 1,
        public title: string = "Select player to remove up to " + count + " " + resource
    ){
        this.playerInput = new SelectPlayer(
          candidates,
          this.title,
          "Remove",
          (found: Player) => {
            found.setResource(this.resource, -this.count, game, player);
            return undefined;
          }
        );
    };

    public beforeAction(): void {
		if (this.resource === Resources.PLANTS) {
			this.candidates = this.game.getPlayers().filter((p) => p.id !== this.player.id && !p.plantsAreProtected() && p.getResource(this.resource) > 0);
		} else {
			this.candidates = this.game.getPlayers().filter((p) => p.id !== this.player.id && p.getResource(this.resource) > 0);
		}

		if (this.candidates.length === 0) {
			this.playerInput = undefined;
		} else if (this.candidates.length === 1) {
			const qtyToRemove = Math.min(this.candidates[0].plants, this.count);
			if (this.resource === Resources.PLANTS) {
				this.playerInput = new OrOptions(
					new SelectOption("Remove " + qtyToRemove + " plants from " + this.candidates[0].name, "Remove plants", () => {
						this.candidates[0].setResource(this.resource, -qtyToRemove, this.game, this.player);
						return undefined;
					}),
					new SelectOption("Skip removing plants", "Confirm", () => {
						return undefined;
					})
				);
			} else {
				this.candidates[0].setResource(this.resource, -qtyToRemove, this.game, this.player);
				this.playerInput = undefined;
			}
		} else {
			if (this.resource === Resources.PLANTS) {
				const removalOptions = this.candidates.map((candidate) => {
					const qtyToRemove = Math.min(candidate.plants, this.count);
					return new SelectOption("Remove " + qtyToRemove + " plants from " + candidate.name, "Remove plants", () => {
						candidate.setResource(this.resource, -qtyToRemove, this.game, this.player);
						return undefined;
					})
				});
				this.playerInput = new OrOptions(
					...removalOptions,
					new SelectOption("Skip removing plants", "Confirm", () => {
						return undefined;
					})
				);
			} else {
				this.playerInput = new SelectPlayer(
					this.candidates,
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
