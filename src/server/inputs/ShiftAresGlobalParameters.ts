import {BasePlayerInput} from '../PlayerInput';
import {IPlayer} from '../IPlayer';
import {AresGlobalParametersResponse} from '../../common/inputs/AresGlobalParametersResponse';
import {InputResponse, isAresGlobalParametersResponse, isShiftAresGlobalParametersResponse} from '../../common/inputs/InputResponse';

export class ShiftAresGlobalParameters extends BasePlayerInput {
  constructor(
    public player: IPlayer,
    public cb: (units: AresGlobalParametersResponse) => undefined) {
    super('aresGlobalParameters', 'Adjust Ares global parameters up to 1 step.');
  }

  public process(input: InputResponse, _player: IPlayer) {
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
