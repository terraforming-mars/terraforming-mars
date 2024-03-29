import {Message} from '../../../common/logs/Message';
import {PlayerInput} from '../../PlayerInput';
import {BasePlayerInput} from '../../PlayerInput';
import {InputResponse, SelectOptionResponse} from '../../../common/inputs/InputResponse';
import {SelectOptionModel} from '../../../common/models/PlayerInputModel';
import {Warning} from '../../../common/cards/Warning';
import { PlayerInputType } from '../../../common/input/PlayerInputType';

export class SelectOption extends BasePlayerInput<undefined> {
  constructor(
    title: string | Message,
    buttonLabel: string = 'Confirm') {
    super(PlayerInputType.OPTION, title);
    this.buttonLabel = buttonLabel;
  }

  public warnings: Array<Warning> | undefined = undefined;

  public override toModel(): SelectOptionModel {
    return {
      title: this.title,
      buttonLabel: this.buttonLabel,
      type: PlayerInputType.OPTION,
      warnings: this.warnings,
    };
  }
  public process(response: InputResponse): PlayerInput | undefined {
    this.ResponseAsType<SelectOptionResponse>(response);
    return this.cb(undefined);
  }
}
