import {Message} from '../../common/logs/Message';
import {BasePlayerInput, PlayerInput} from '../PlayerInput';
import {IPlayer} from '../IPlayer';
import {NeutralPlayer} from '../turmoil/Turmoil';
import {InputResponse, isSelectDelegateResponse} from '../../common/inputs/InputResponse';

export class SelectDelegate extends BasePlayerInput {
  // TODO(kberg): is there any reason to not just accept IDs?
  constructor(
    public players: Array<IPlayer | NeutralPlayer>,
    title: string | Message,
    public cb: (player: IPlayer | NeutralPlayer) => PlayerInput | undefined) {
    super('delegate', title);
  }

  public process(input: InputResponse) {
    if (!isSelectDelegateResponse(input)) {
      throw new Error('Not a valid SelectDelegateResponse');
    }
    const foundPlayer = this.players.find((player) =>
      player === input.player ||
      (typeof(player) === 'object' && (player.id === input.player || player.color === input.player)),
    );
    if (foundPlayer === undefined) {
      throw new Error('Player not available');
    }

    return this.cb(foundPlayer);
  }
}
