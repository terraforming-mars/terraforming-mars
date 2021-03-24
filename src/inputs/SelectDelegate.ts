import {Message} from '../Message';
import {PlayerInput} from '../PlayerInput';
import {Player} from '../Player';
import {PlayerInputTypes} from '../PlayerInputTypes';
import {NeutralPlayer} from '../turmoil/Turmoil';

export class SelectDelegate implements PlayerInput {
    public inputType: PlayerInputTypes = PlayerInputTypes.SELECT_DELEGATE;
    public buttonLabel: string = 'Save';
    constructor(public players: Array<Player | NeutralPlayer>, public title: string | Message, public cb: (player: Player | NeutralPlayer) => PlayerInput | undefined) {
    }

    public runInput(player: Player, input: ReadonlyArray<ReadonlyArray<string>>) {
      PlayerInput.checkInputLength(input, 1, 1);
      const foundPlayer = this.players.find((p) =>
        p === input[0][0] ||
          (p instanceof Player && (p.id === input[0][0] || p.color === input[0][0])),
      );
      if (foundPlayer === undefined) {
        throw new Error('Player not available');
      }
      player.runInputCb(this.cb(foundPlayer));
    }
}
