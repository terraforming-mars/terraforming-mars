import {Message} from '../../common/logs/Message';
import {PlayerInput} from '../PlayerInput';
import {PlayerInputType} from '../../common/input/PlayerInputType';
import {InputResponse, isSelectOptionResponse} from '../../common/inputs/InputResponse';

export class SelectOption implements PlayerInput {
  public readonly inputType = PlayerInputType.SELECT_OPTION;
  constructor(
        public title: string | Message,
        public buttonLabel: string = 'Select',
        public cb: () => PlayerInput | undefined) {
    this.buttonLabel = buttonLabel;
  }

  public process(response: InputResponse): PlayerInput | undefined {
    if (!isSelectOptionResponse(response)) {
      throw new Error('Not a valid SelectOptionResponse');
    }
    return this.cb();
  }
}
