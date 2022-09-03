import {Message} from '../../common/logs/Message';
import {PlayerInput} from '../PlayerInput';
import {Player} from '../Player';
import {PlayerInputType} from '../../common/input/PlayerInputType';
import {NeutralPlayer} from '../turmoil/Turmoil';
import {InputResponse} from '../../common/inputs/InputResponse';

export class SelectDelegate implements PlayerInput {
  public readonly inputType = PlayerInputType.SELECT_DELEGATE;
  public buttonLabel: string = 'Save';
  constructor(public players: Array<Player | NeutralPlayer>, public title: string | Message, public cb: (player: Player | NeutralPlayer) => PlayerInput | undefined) {
  }

  public process(input: InputResponse, player: Player) {
    player.checkInputLength(input, 1, 1);
    const foundPlayer = this.players.find((player) =>
      player === input[0][0] ||
      (player instanceof Player && (player.id === input[0][0] || player.color === input[0][0])),
    );
    if (foundPlayer === undefined) {
      throw new Error('Player not available');
    }

    return this.cb(foundPlayer);
  }
}
