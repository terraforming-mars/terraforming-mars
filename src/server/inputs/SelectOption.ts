import {Message} from '../../common/logs/Message';
import {BasePlayerInput, PlayerInput} from '../PlayerInput';
import {PlayerInputType} from '../../common/input/PlayerInputType';
import {InputResponse, isSelectOptionResponse} from '../../common/inputs/InputResponse';

export class SelectOption extends BasePlayerInput {
  constructor(
    title: string | Message,
    buttonLabel: string = 'Select',
    public cb: () => PlayerInput | undefined) {
    super(PlayerInputType.SELECT_OPTION, title);
    this.buttonLabel = buttonLabel;
  }

  public process(response: InputResponse): PlayerInput | undefined {
    if (!isSelectOptionResponse(response)) {
      throw new Error('Not a valid SelectOptionResponse');
    }
    return this.cb();
  }
}
