import { Player } from "../Player";
import { SelectHowToPay } from "../inputs/SelectHowToPay";
import { HowToPay } from "../inputs/HowToPay";
import { DeferredAction } from "./DeferredAction";

export class SelectHowToPayDeferred implements DeferredAction {
    constructor(
        public player: Player,
        public amount: number,
        public canUseSteel: boolean,
        public canUseTitanium: boolean,
        public title: string = "Select how to pay for " + amount + " MCs",
        public afterPay?: () => void
    ){}

    public execute() {
        if ((!this.player.canUseHeatAsMegaCredits || this.player.heat === 0) &&
            (!this.canUseSteel || this.player.steel === 0) &&
            (!this.canUseTitanium || this.player.titanium === 0)) {
            this.player.megaCredits -= this.amount;
            if (this.afterPay !== undefined) {
                this.afterPay();
            }
            return undefined;
        }

        return new SelectHowToPay(
            this.title, 
            this.canUseSteel, this.canUseTitanium, this.player.canUseHeatAsMegaCredits, this.amount, (howToPay: HowToPay) => {
                this.player.steel -= howToPay.steel;
                this.player.titanium -= howToPay.titanium;
                this.player.megaCredits -= howToPay.megaCredits;
                this.player.heat -= howToPay.heat;
                if (this.afterPay !== undefined) {
                    this.afterPay();
                }
                return undefined;
            }
        );
    }
}    
