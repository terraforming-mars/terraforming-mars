import { PlayerInterrupt } from "./PlayerInterrupt";
import { PlayerInput } from "../PlayerInput";
import { Player } from "../Player";
import { ShiftAresGlobalParameters } from "../inputs/ShiftAresGlobalParameters";
import { Game } from "../Game";
import { AresHandler } from "../ares/AresHandler";

export class ShiftAresGlobalParametersInterrupt implements PlayerInterrupt {
    public playerInput: PlayerInput;
    constructor(public game: Game, public player: Player) {
        let pi : PlayerInput | undefined = undefined;
        AresHandler.ifAres(game, aresData => {
            pi = new ShiftAresGlobalParameters(
                player,
                aresData,
                (response: IAresGlobalParametersResponse) => {
                    const hazardData = aresData.hazardData;
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
                        AresHandler.onTemperatureChange(game, aresData);
                    }
                    if (response.oxygenDelta !== 0) {
                        AresHandler.onOxygenChange(game, aresData);
                    }
                    if (response.lowOceanDelta !== 0 || response.highOceanDelta !== 0) {
                        AresHandler.onOceanPlaced(game, aresData, player);
                    }
                    return undefined;
                });
        });
        if (pi === undefined) {
            throw new Error("Should not reach.");
        }
        this.playerInput = pi;
    };
}

export interface IAresGlobalParametersResponse {
  lowOceanDelta: -1 | 0 | 1;
  highOceanDelta:  -1 | 0 | 1;
  temperatureDelta:  -1 | 0 | 1;
  oxygenDelta:  -1 | 0 | 1;
}