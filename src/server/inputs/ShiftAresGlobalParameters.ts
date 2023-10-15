import {BasePlayerInput} from '../PlayerInput';
import {IPlayer} from '../IPlayer';
import {AresGlobalParametersResponse} from '../../common/inputs/AresGlobalParametersResponse';
import {InputResponse, isAresGlobalParametersResponse, isShiftAresGlobalParametersResponse} from '../../common/inputs/InputResponse';
import {ShiftAresGlobalParametersModel} from '../../common/models/PlayerInputModel';

export class ShiftAresGlobalParameters extends BasePlayerInput<AresGlobalParametersResponse> {
  constructor() {
    super('aresGlobalParameters', 'Adjust Ares global parameters up to 1 step.');
  }

  public toModel(player: IPlayer): ShiftAresGlobalParametersModel {
    if (player.game.aresData === undefined) {
      throw new Error('Ares is not defined');
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
