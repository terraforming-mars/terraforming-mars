import {BasePlayerInput} from '../PlayerInput';
import {IPlayer} from '../IPlayer';
import {InputResponse, isSelectClaimedUndergroundTokenResponse} from '../../common/inputs/InputResponse';
import {SelectClaimedUndergroundTokenModel} from '../../common/models/PlayerInputModel';
import {InputError} from './InputError';
import {ClaimedToken} from '../../common/underworld/UnderworldPlayerData';

export class SelectClaimedUndergroundToken extends BasePlayerInput<Array<number>> {
  constructor(public tokens: ReadonlyArray<ClaimedToken>, public count: number) {
    super('claimedUndergroundToken', 'Select claimed underground token');
  }

  public toModel(_player: IPlayer): SelectClaimedUndergroundTokenModel {
    return {
      title: this.title,
      buttonLabel: this.buttonLabel,
      type: 'claimedUndergroundToken',
      count: this.count,
      tokens: this.tokens,
    };
  }
  public process(input: InputResponse, _player: IPlayer) {
    if (!isSelectClaimedUndergroundTokenResponse(input)) {
      throw new InputError('Not a valid isSelectClaimedUndergroundTokenResponse');
    }

    if (input.selected.length !== this.count) {
      throw new InputError(`Expected ${this.count} tokens, got ${input.selected.length}`);
    }

    if (new Set(input.selected).size !== input.selected.length) {
      throw new InputError('Duplicate tokens selected');
    }

    if (input.selected.some((i) => i < 0 || i >= this.tokens.length)) {
      throw new InputError('Selected token index out of range');
    }
    this.cb(input.selected);
    return undefined;
  }
}
