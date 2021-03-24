
import {Message} from '../Message';
import {PlayerInput} from '../PlayerInput';
import {Player} from '../Player';
import {PlayerInputTypes} from '../PlayerInputTypes';

export class SelectPlayer implements PlayerInput {
    public inputType: PlayerInputTypes = PlayerInputTypes.SELECT_PLAYER;
    constructor(public players: Array<Player>, public title: string | Message, public buttonLabel: string = 'Save', public cb: (player: Player) => PlayerInput | undefined) {
      this.buttonLabel = buttonLabel;
    }

    public runInput(player: Player, input: ReadonlyArray<ReadonlyArray<string>>) {
      PlayerInput.checkInputLength(input, 1, 1);
      const foundPlayer = this.players.find(
        (p) => p.color === input[0][0] || p.id === input[0][0],
      );
      if (foundPlayer === undefined) {
        throw new Error('Player not available');
      }
      player.runInputCb(this.cb(foundPlayer));
    }
}
