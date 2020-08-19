import { PlayerInput } from "../PlayerInput";
import { Player } from "../Player";
import { PlayerInterrupt } from "./PlayerInterrupt";
import { SelectHowToPay } from "../inputs/SelectHowToPay";
import { HowToPay } from "../inputs/HowToPay";

export class SelectHowToPayInterrupt implements PlayerInterrupt {
    public playerInput: PlayerInput;
    constructor(
        public player: Player,
        public amount: number,
        public title: string = "Select how to pay for " + amount + " MCs",
        public canUseSteel: boolean,
        public canUseTitanium: boolean,
    ){
        this.playerInput = new SelectHowToPay(
            title, 
            canUseSteel, canUseTitanium, player.canUseHeatAsMegaCredits, amount, (howToPay: HowToPay) => {
                player.steel -= howToPay.steel;
                player.titanium -= howToPay.titanium;
                player.megaCredits -= howToPay.megaCredits;
                player.heat -= howToPay.heat;
                return undefined;
            })
    };
}    
