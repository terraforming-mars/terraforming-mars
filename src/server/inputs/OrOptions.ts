import {PlayerInput} from '../PlayerInput';
import {PlayerInputType} from '../../common/input/PlayerInputType';
import {Message} from '../../common/logs/Message';
import {InputResponse} from '../../common/inputs/InputResponse';
import {Player} from '../Player';

export class OrOptions implements PlayerInput {
  public cb(): PlayerInput | undefined {
    return undefined;
  }
  public title: string | Message = 'Select one option';
  public buttonLabel: string = 'Save';
  public options: Array<PlayerInput>;
  public readonly inputType = PlayerInputType.OR_OPTIONS;
  constructor(
    ...options: Array<PlayerInput>
  ) {
    this.options = options;
  }

  public process(input: InputResponse, player: Player) {
    // input length is variable, can't test it with checkInputLength
    if (input.length === 0 || input[0].length !== 1) {
      throw new Error('Incorrect options provided');
    }
    const optionIndex = parseInt(input[0][0]);
    const selectedOptionInput = input.slice(1);

    player.runInput(selectedOptionInput, this.options[optionIndex]);
    return this.cb();
  }
}
