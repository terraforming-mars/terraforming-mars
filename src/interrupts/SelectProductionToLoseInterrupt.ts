import { SelectProductionToLose } from "../inputs/SelectProductionToLose";
import { Player } from "../Player";
import { PlayerInput } from "../PlayerInput";
import { IProductionUnits } from "../inputs/IProductionUnits";
import { Resources } from "../Resources";
import { PlayerInterrupt } from "./PlayerInterrupt";
export class SelectProductionToLoseInterrupt implements PlayerInterrupt {
    public playerInput: PlayerInput;
    constructor(
        public player: Player,
        public unitsToLose: number,
        public title: string = `Choose ${unitsToLose} unit(s) of production to lose`,
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
