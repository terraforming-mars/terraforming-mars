import {Message} from '../../common/logs/Message';
import {InputResponse, isSelectClaimedTokenResponse} from '../../common/inputs/InputResponse';
import {SelectClaimedTokenModel} from '../../common/models/PlayerInputModel';
import {BasePlayerInput} from '../PlayerInput';
import {InputError} from './InputError';
import {ClaimedToken} from '../../common/underworld/UnderworldPlayerData';

export class SelectClaimedToken extends BasePlayerInput<Array<ClaimedToken>> {
  constructor(
    title: string | Message,
    public tokens: ReadonlyArray<ClaimedToken>) {
    super('claimedtoken', title);
    if (tokens.length === 0) {
      throw new InputError('No tokens specified');
    }
  }

  public override toModel(): SelectClaimedTokenModel {
    return {
      title: this.title,
      buttonLabel: this.buttonLabel,
      type: 'claimedtoken',
      tokens: this.tokens,
    };
  }

  public process(input: InputResponse) {
    if (!isSelectClaimedTokenResponse(input)) {
      throw new InputError('Not a valid SelectClaimedToken');
    }
    // Validate
    const tokens = input.tokens;
    return this.cb(tokens);
  }
}
