import {PlayerInput} from '../PlayerInput';
import {PlayerInputTypes} from '../common/input/PlayerInputTypes';
import {Player} from '../Player';
import {IAresData} from '../common/ares/IAresData';
import {IAresGlobalParametersResponse} from '../common/inputs/IAresGlobalParametersResponse';

export class ShiftAresGlobalParameters implements PlayerInput {
  public inputType = PlayerInputTypes.SHIFT_ARES_GLOBAL_PARAMETERS;
  public title = 'Adjust Ares global parameters up to 1 step.';
  public buttonLabel = 'Save';

  constructor(
    public player: Player,
    public aresData: IAresData,
    public cb: (units: IAresGlobalParametersResponse) => undefined) {}
}
