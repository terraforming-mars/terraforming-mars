import {PlayerInput} from '../PlayerInput';
import {PlayerInputTypes} from '../PlayerInputTypes';
import {Player} from '../Player';
import {IAresData} from '../ares/IAresData';

export class ShiftAresGlobalParameters implements PlayerInput {
  public inputType = PlayerInputTypes.SHIFT_ARES_GLOBAL_PARAMETERS;
  public title = 'Adjust Ares global parameters up to 1 step.';
  public buttonLabel = 'Save';

  constructor(
    public player: Player,
    public aresData: IAresData,
    public cb: (units: IAresGlobalParametersResponse) => undefined) {}

  public runInput(player: Player, input: ReadonlyArray<ReadonlyArray<string>>) {
    // TODO(kberg): I'm sure there's some input validation required.
    const response: IAresGlobalParametersResponse = JSON.parse(input[0][0]);
    player.runInputCb(this.cb(response));
  }
}

export interface IAresGlobalParametersResponse {
  lowOceanDelta: -1 | 0 | 1;
  highOceanDelta: -1 | 0 | 1;
  temperatureDelta: -1 | 0 | 1;
  oxygenDelta: -1 | 0 | 1;
}
