import {BasePlayerInput} from '../PlayerInput';
import {IPlayer} from '../IPlayer';
import {AresGlobalParametersResponse} from '../../common/inputs/AresGlobalParametersResponse';
import {InputResponse, isAresGlobalParametersResponse, isShiftAresGlobalParametersResponse} from '../../common/inputs/InputResponse';
import {ShiftAresGlobalParametersModel} from '../../common/models/PlayerInputModel';
import {InputError} from './InputError';

export class ShiftAresGlobalParameters extends BasePlayerInput<AresGlobalParametersResponse> {
  constructor() {
    super('aresGlobalParameters', 'Adjust Ares global parameters up to 1 step.');
  }

  public toModel(player: IPlayer): ShiftAresGlobalParametersModel {
    if (player.game.aresData === undefined) {
      throw new InputError('Ares is not defined');
    }
    return {
      title: this.title,
      buttonLabel: this.buttonLabel,
      type: 'aresGlobalParameters',
      aresData: player.game.aresData,
    };
  }
  public process(input: InputResponse, _player: IPlayer) {
    if (!isShiftAresGlobalParametersResponse(input)) {
      throw new InputError('Not a valid ShiftAresGlobalParametersResponse');
    }
    if (!isAresGlobalParametersResponse(input.response)) {
      throw new InputError('Not a valid ShiftAresGlobalParametersResponse');
    }

    this.validateNumber(input.response.lowOceanDelta);
    this.validateNumber(input.response.highOceanDelta);
    this.validateNumber(input.response.temperatureDelta);
    this.validateNumber(input.response.oxygenDelta);

    this.cb(input.response);
    return undefined;
  }

  private validateNumber(val: number) {
    if (!Number.isInteger(val)) {
      throw new Error('value is not a number');
    }
    if (val < -1 || val > 1) {
      throw new Error('value is out of range');
    }
  }
}
