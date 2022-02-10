import {DeferredAction, Priority} from './DeferredAction';
import {Player} from '../Player';
import {IAresGlobalParametersResponse, ShiftAresGlobalParameters} from '../inputs/ShiftAresGlobalParameters';
import {AresHandler} from '../ares/AresHandler';
import {PlayerInput} from '../PlayerInput';

export class ShiftAresGlobalParametersDeferred implements DeferredAction {
  public priority = Priority.DEFAULT;
  constructor(
        public player: Player) { }
  public execute() {
    let pi: PlayerInput | undefined = undefined;
    AresHandler.ifAres(this.player.game, (aresData) => {
      pi = new ShiftAresGlobalParameters(
        this.player,
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
            AresHandler.onTemperatureChange(this.player.game, aresData);
          }
          if (response.oxygenDelta !== 0) {
            AresHandler.onOxygenChange(this.player.game, aresData);
          }
          if (response.lowOceanDelta !== 0 || response.highOceanDelta !== 0) {
            AresHandler.onOceanPlaced(aresData, this.player);
          }
          return undefined;
        });
    });
    if (pi === undefined) {
      throw new Error('Should not reach.');
    }
    return pi;
  }
}
