import { DeferredAction } from "./DeferredAction";
import { Player } from "../Player";
import { IAresGlobalParametersResponse, ShiftAresGlobalParameters } from "../inputs/ShiftAresGlobalParameters";
import { Game } from "../Game";
import { AresHandler } from "../ares/AresHandler";

export class ShiftAresGlobalParametersDeferred implements DeferredAction {
    constructor(
        private game: Game,
        public player: Player){ }
    public execute() {
        return new ShiftAresGlobalParameters(
            this.player,
            // TODO(kberg): drop this aresData!
            this.game.aresData!,
            (response: IAresGlobalParametersResponse) => {
                const hazardData = this.game.aresData!.hazardData;
                if (hazardData.erosionOceanCount.available) {
                    hazardData.erosionOceanCount.threshold += response.lowOceanDelta;
                }
                if (hazardData.removeDustStormsOceanCount.available) {
                    hazardData.removeDustStormsOceanCount.threshold += response.highOceanDelta;
                }
                if (hazardData.severeErosionTemperature.available) {
                    hazardData.severeErosionTemperature.threshold += (response.temperatureDelta * 2);
                }
                if (hazardData.severeDustStormOxygen.available) {
                    hazardData.severeDustStormOxygen.threshold += response.oxygenDelta;
                }

                // Basically the order is irrelevant, but evaluating the severe erosions
                // first reduces the visual impact on players when this action simultaneously
                // reveals erosions and makes them severe.
                if (response.temperatureDelta !== 0) {
                    AresHandler.onTemperatureChange(this.game);
                }
                if (response.oxygenDelta !== 0) {
                    AresHandler.onOxygenChange(this.game);
                }
                if (response.lowOceanDelta !== 0 || response.highOceanDelta !== 0) {
                    AresHandler.onOceanPlaced(this.game, this.player);
                }
                return undefined;
            });
    };
}
