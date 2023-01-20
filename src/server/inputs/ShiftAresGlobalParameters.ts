import {BasePlayerInput} from '../PlayerInput';
import {PlayerInputType} from '../../common/input/PlayerInputType';
import {Player} from '../Player';
import {AresGlobalParametersResponse} from '../../common/inputs/AresGlobalParametersResponse';
import {InputResponse, isAresGlobalParametersResponse, isShiftAresGlobalParametersResponse} from '../../common/inputs/InputResponse';

export class ShiftAresGlobalParameters extends BasePlayerInput {
  constructor(
    public player: Player,
    public cb: (units: AresGlobalParametersResponse) => undefined) {
    super(PlayerInputType.SHIFT_ARES_GLOBAL_PARAMETERS, 'Adjust Ares global parameters up to 1 step.');
  }

  public process(input: InputResponse, _player: Player) {
    if (!isShiftAresGlobalParametersResponse(input)) {
      throw new Error('Not a valid ShiftAresGlobalParametersResponse');
    }
    if (!isAresGlobalParametersResponse(input.response)) {
      throw new Error('Not a valid ShiftAresGlobalParametersResponse');
    }

    if (!this.inRange(input.response.lowOceanDelta) ||
      !this.inRange(input.response.highOceanDelta) ||
      !this.inRange(input.response.temperatureDelta) ||
      !this.inRange(input.response.oxygenDelta)) {
      throw new Error('values out of range');
    }
    this.cb(input.response);
    return undefined;
  }

  private inRange(val: number) {
    return (val >= -1 && val <= 1);
  }
}
