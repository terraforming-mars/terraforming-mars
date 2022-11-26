import {Message} from '../../common/logs/Message';
import {PlayerInput} from '../PlayerInput';
import {Player} from '../Player';
import {PlayerInputType} from '../../common/input/PlayerInputType';
import {NeutralPlayer} from '../turmoil/Turmoil';
import {InputResponse, isSelectDelegateResponse} from '../../common/inputs/InputResponse';

export class SelectDelegate implements PlayerInput {
  public readonly inputType = PlayerInputType.SELECT_DELEGATE;
  public buttonLabel: string = 'Save';
  // TODO(kberg): is there any reason to not just accept IDs?
  constructor(
    public players: Array<Player | NeutralPlayer>,
    public title: string | Message,
    public cb: (player: Player | NeutralPlayer) => PlayerInput | undefined) {
  }

  public process(input: InputResponse) {
    if (!isSelectDelegateResponse(input)) {
      throw new Error('Not a valid SelectDelegateResponse');
    }
    const foundPlayer = this.players.find((player) =>
      player === input.player ||
      (player instanceof Player && (player.id === input.player || player.color === input.player)),
    );
    if (foundPlayer === undefined) {
      throw new Error('Player not available');
    }

    return this.cb(foundPlayer);
  }
}
