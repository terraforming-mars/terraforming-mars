import {PlayerInput} from '../PlayerInput';
import {PlayerInputTypes} from '../common/input/PlayerInputTypes';
import {SelectAmount} from './SelectAmount';
import {SelectCard} from './SelectCard';
import {SelectPlayer} from './SelectPlayer';
import {SelectOption} from './SelectOption';
import {SelectHowToPay} from './SelectHowToPay';
import {ICard} from '../cards/ICard';
import {IProjectCard} from '../cards/IProjectCard';
import {SelectDelegate} from './SelectDelegate';
import {SelectColony} from './SelectColony';
import {Message} from '../common/logs/Message';
import {InputResponse} from '../common/inputs/InputResponse';
import {Player} from '../Player';

export class OrOptions implements PlayerInput {
  public cb(): PlayerInput | undefined {
    return undefined;
  }
  public title: string | Message = 'Select one option';
  public buttonLabel: string = 'Save';
  public options: Array<PlayerInput>;
  public inputType: PlayerInputTypes = PlayerInputTypes.OR_OPTIONS;
  constructor(
    ...options: Array<SelectAmount | SelectCard<ICard> | SelectCard<IProjectCard>| SelectPlayer | SelectOption | SelectHowToPay | SelectDelegate | SelectColony>
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
