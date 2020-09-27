import { PlayerInterrupt } from "../../../../git/terraforming-mars/src/interrupts/PlayerInterrupt";
import { SelectProductionToLose } from "../inputs/SelectProductionToLose";
import { Player } from "../Player";
import { PlayerInput } from "../PlayerInput";
import { IProductionUnits } from "../inputs/IProductionUnits";
import { Resources } from "../Resources";
export class SelectProductionToLoseInterrupt implements PlayerInterrupt {
    public playerInput: PlayerInput;
    constructor(
        public player: Player,
        public unitsToLose: number,
        public title: string = `Select how to pay for ${unitsToLose} units of production`,
    ){
        this.playerInput = new SelectProductionToLose(
            title,
            unitsToLose,
            player,
            (units: IProductionUnits) => {
                if (units.megacredits > 0) {
                    player.setProduction(Resources.MEGACREDITS, -units.megacredits);
                }
                if (units.steel > 0) {
                    player.setProduction(Resources.STEEL, -units.steel);
                }
                if (units.titanium > 0) {
                    player.setProduction(Resources.TITANIUM, -units.titanium);
                }
                if (units.plants > 0) {
                    player.setProduction(Resources.PLANTS, -units.plants);
                }
                if (units.energy > 0) {
                    player.setProduction(Resources.ENERGY, -units.energy);
                }
                if (units.heat > 0) {
                    player.setProduction(Resources.HEAT, -units.heat);
                }
                return undefined;
            });
    };
}    
