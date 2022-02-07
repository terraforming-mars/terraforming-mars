import {PlayerInput} from '../PlayerInput';
import {PlayerInputTypes} from '../common/input/PlayerInputTypes';
import {Player} from '../Player';
import {IAresData} from '../common/ares/IAresData';

export class ShiftAresGlobalParameters implements PlayerInput {
  public inputType = PlayerInputTypes.SHIFT_ARES_GLOBAL_PARAMETERS;
  public title = 'Adjust Ares global parameters up to 1 step.';
  public buttonLabel = 'Save';

  constructor(
        public player: Player,
        public aresData: IAresData,
        public cb: (units: IAresGlobalParametersResponse) => undefined) {}
}

export interface IAresGlobalParametersResponse {
    lowOceanDelta: -1 | 0 | 1;
    highOceanDelta: -1 | 0 | 1;
    temperatureDelta: -1 | 0 | 1;
    oxygenDelta: -1 | 0 | 1;
  }
