import { Player } from "../Player";
import { PlayerInput } from "../PlayerInput";
import { PlayerInterrupt } from "./PlayerInterrupt";
import { SelectHowToPay } from "../inputs/SelectHowToPay";
import { HowToPay } from "../inputs/HowToPay";

export class SelectHowToPayInterrupt implements PlayerInterrupt {
    public playerInput?: PlayerInput;
    constructor(
        public player: Player,
        public amount: number,
        public title: string = "Select how to pay for " + amount + " MCs",
        public canUseSteel: boolean,
        public canUseTitanium: boolean,
    ){}

    public generatePlayerInput() {
        if ((!this.player.canUseHeatAsMegaCredits || this.player.heat === 0) &&
            (!this.canUseSteel || this.player.steel === 0) &&
            (!this.canUseTitanium || this.player.titanium === 0)) {
                this.player.megaCredits -= this.amount;
                this.playerInput = undefined;
                return;
        }
        this.playerInput = new SelectHowToPay(
            this.title, 
            this.canUseSteel, this.canUseTitanium, this.player.canUseHeatAsMegaCredits, this.amount, (howToPay: HowToPay) => {
                this.player.steel -= howToPay.steel;
                this.player.titanium -= howToPay.titanium;
                this.player.megaCredits -= howToPay.megaCredits;
                this.player.heat -= howToPay.heat;
                return undefined;
            }
        );
    }
}    
