import { SelectProductionToLose } from "../inputs/SelectProductionToLose";
import { Player } from "../Player";
import { IProductionUnits } from "../inputs/IProductionUnits";
import { Resources } from "../Resources";
import { DeferredAction } from "./DeferredAction";

export class SelectProductionToLoseDeferred implements DeferredAction {
    constructor(
        public player: Player,
        private unitsToLose: number,
        private title: string = `Choose ${unitsToLose} unit(s) of production to lose`,
    ){}

    public execute() {
        return new SelectProductionToLose(
            this.title,
            this.unitsToLose,
            this.player,
            (units: IProductionUnits) => {
                if (units.megacredits > 0) {
                    this.player.addProduction(Resources.MEGACREDITS, -units.megacredits);
                }
                if (units.steel > 0) {
                    this.player.addProduction(Resources.STEEL, -units.steel);
                }
                if (units.titanium > 0) {
                    this.player.addProduction(Resources.TITANIUM, -units.titanium);
                }
                if (units.plants > 0) {
                    this.player.addProduction(Resources.PLANTS, -units.plants);
                }
                if (units.energy > 0) {
                    this.player.addProduction(Resources.ENERGY, -units.energy);
                }
                if (units.heat > 0) {
                    this.player.addProduction(Resources.HEAT, -units.heat);
                }
                return undefined;
            }
        );
    }
}
