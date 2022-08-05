import {PlayerInput} from '../PlayerInput';
import {PlayerInputTypes} from '../common/input/PlayerInputTypes';
import {Player} from '../Player';
import {AresData} from '../common/ares/AresData';
import {IAresGlobalParametersResponse} from '../common/inputs/IAresGlobalParametersResponse';
import {InputResponse} from '../common/inputs/InputResponse';

export class ShiftAresGlobalParameters implements PlayerInput {
  public inputType = PlayerInputTypes.SHIFT_ARES_GLOBAL_PARAMETERS;
  public title = 'Adjust Ares global parameters up to 1 step.';
  public buttonLabel = 'Save';

  constructor(
    public player: Player,
    public aresData: AresData,
    public cb: (units: IAresGlobalParametersResponse) => undefined) {}

  public process(input: InputResponse, _player: Player) {
    // TODO(kberg): I'm sure there's some input validation required.
    const response: IAresGlobalParametersResponse = JSON.parse(input[0][0]);
    this.cb(response);
    return undefined;
  }
}
