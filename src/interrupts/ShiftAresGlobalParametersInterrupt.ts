import { PlayerInterrupt } from "./PlayerInterrupt";
import { PlayerInput } from "../PlayerInput";
import { Player } from "../Player";
import { ShiftAresGlobalParameters } from "../inputs/ShiftAresGlobalParameters";
import { Game } from "../Game";
import { AresHandler } from "../ares/AresHandler";

export class ShiftAresGlobalParametersInterrupt implements PlayerInterrupt {
    public playerInput: PlayerInput;
    constructor(public game: Game, public player: Player){
        this.playerInput = new ShiftAresGlobalParameters(
            player,
            game.aresData!,
            (response: IAresGlobalParametersResponse) => {
                var hazardData = game.aresData!.hazardData;
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
                    AresHandler.onTemperatureChange(game);
                }
                if (response.oxygenDelta !== 0) {
                    AresHandler.onOxygenChange(game);
                }
                if (response.lowOceanDelta !== 0 || response.highOceanDelta !== 0) {
                    AresHandler.onOceanPlaced(game, player, false);
                }
                return undefined;
            });
    };
}

export interface IAresGlobalParametersResponse {
  lowOceanDelta: -1 | 0 | 1;
  highOceanDelta:  -1 | 0 | 1;
  temperatureDelta:  -1 | 0 | 1;
  oxygenDelta:  -1 | 0 | 1;
}