import {DeferredAction} from '@/server/deferredActions/DeferredAction';
import {Priority} from '@/server/deferredActions/Priority';
import {IPlayer} from '@/server/IPlayer';
import {ShiftAresGlobalParameters} from '@/server/inputs/ShiftAresGlobalParameters';
import {AresHandler} from '@/server/ares/AresHandler';
import {PlayerInput} from '@/server/PlayerInput';

export class ShiftAresGlobalParametersDeferred extends DeferredAction {
  constructor(player: IPlayer) {
    super(player, Priority.DEFAULT);
  }

  public execute() {
    let pi: PlayerInput | undefined = undefined;
    AresHandler.ifAres(this.player.game, (aresData) => {
      pi = new ShiftAresGlobalParameters()
        .andThen((response) => {
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
