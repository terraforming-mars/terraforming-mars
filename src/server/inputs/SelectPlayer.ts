import {Message} from '../../common/logs/Message';
import {PlayerInput} from '../PlayerInput';
import {Player} from '../Player';
import {PlayerInputType} from '../../common/input/PlayerInputType';
import {InputResponse} from '../../common/inputs/InputResponse';

export class SelectPlayer implements PlayerInput {
  public readonly inputType = PlayerInputType.SELECT_PLAYER;
  constructor(public players: Array<Player>, public title: string | Message, public buttonLabel: string = 'Save', public cb: (player: Player) => PlayerInput | undefined) {
    this.buttonLabel = buttonLabel;
  }

  public process(input: InputResponse, player: Player) {
    player.checkInputLength(input, 1, 1);
    const foundPlayer = this.players.find(
      (player) => player.color === input[0][0] || player.id === input[0][0],
    );
    if (foundPlayer === undefined) {
      throw new Error('Player not available');
    }
    return this.cb(foundPlayer);
  }
}
