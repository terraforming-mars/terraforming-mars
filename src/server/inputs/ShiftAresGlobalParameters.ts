import {PlayerInput} from '../PlayerInput';
import {PlayerInputType} from '../../common/input/PlayerInputType';
import {Player} from '../Player';
import {AresData} from '../../common/ares/AresData';
import {AresGlobalParametersResponse} from '../../common/inputs/AresGlobalParametersResponse';
import {InputResponse} from '../../common/inputs/InputResponse';

export class ShiftAresGlobalParameters implements PlayerInput {
  public readonly inputType = PlayerInputType.SHIFT_ARES_GLOBAL_PARAMETERS;
  public title = 'Adjust Ares global parameters up to 1 step.';
  public buttonLabel = 'Save';

  constructor(
    public player: Player,
    public aresData: AresData,
    public cb: (units: AresGlobalParametersResponse) => undefined) {}

  public process(input: InputResponse, _player: Player) {
    // TODO(kberg): I'm sure there's some input validation required.
    const response: AresGlobalParametersResponse = JSON.parse(input[0][0]);
    this.cb(response);
    return undefined;
  }
}
