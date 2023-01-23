import {Message} from '../../common/logs/Message';
import {BasePlayerInput, PlayerInput} from '../PlayerInput';
import {Player} from '../Player';
import {PlayerInputType} from '../../common/input/PlayerInputType';
import {NeutralPlayer} from '../turmoil/Turmoil';
import {InputResponse, isSelectDelegateResponse} from '../../common/inputs/InputResponse';
import {PlayerInputModel} from '../../common/models/PlayerInputModel';

export class SelectDelegate extends BasePlayerInput {
  // TODO(kberg): is there any reason to not just accept IDs?
  constructor(
    public players: Array<Player | NeutralPlayer>,
    title: string | Message,
    public cb: (player: Player | NeutralPlayer) => PlayerInput | undefined) {
    super(PlayerInputType.SELECT_DELEGATE, title);
  }

  public override toModel(model: PlayerInputModel, _player: Player) {
    model.players = this.players.map(
      (player) => (player === 'NEUTRAL') ? 'NEUTRAL' : player.color,
    );
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
