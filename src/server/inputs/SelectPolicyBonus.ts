import {Message} from '../../common/logs/Message';
import {BasePlayerInput} from '../PlayerInput';
import {InputResponse, isSelectBonusResponse} from '../../common/inputs/InputResponse';
import {IPlayer} from '../IPlayer';
import {getTurmoilModel} from '../models/TurmoilModel';
import {InputError} from './InputError';
import {BonusId} from '../../common/turmoil/Types';
import {SelectBonusModel} from '../../common/models/PlayerInputModel';

export class SelectPolicyBonus extends BasePlayerInput<BonusId> {
  constructor(
    title: string | Message,
    buttonLabel: string = 'Select bonus',
    public bonuses: Array<BonusId>) {
    super('bonus', title);
    this.buttonLabel = buttonLabel;
  }

  public override toModel(player: IPlayer): SelectBonusModel {
    const turmoil = getTurmoilModel(player.game);
    if (turmoil === undefined) {
      throw new InputError('This game is not set up for Turmoil.');
    }
    return {
      title: this.title,
      buttonLabel: this.buttonLabel,
      type: 'bonus',
      bonuses: this.bonuses,
    };
  }

  public process(input: InputResponse) {
    if (!isSelectBonusResponse(input)) {
      throw new InputError('Not a valid SelectBonusResponse');
    }
    if (input.bonusId === undefined) {
      throw new InputError('No bonus selected');
    }
    if (!this.bonuses.includes(input.bonusId)) {
      throw new InputError('Invalid bonus selected');
    }
    return this.cb(input.bonusId);
  }
}
