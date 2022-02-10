
import {Message} from '../common/logs/Message';
import {PlayerInput} from '../PlayerInput';
import {Player} from '../Player';
import {PlayerInputTypes} from '../common/input/PlayerInputTypes';
import {NeutralPlayer} from '../turmoil/Turmoil';

export class SelectDelegate implements PlayerInput {
  public inputType: PlayerInputTypes = PlayerInputTypes.SELECT_DELEGATE;
  public buttonLabel: string = 'Save';
  constructor(public players: Array<Player | NeutralPlayer>, public title: string | Message, public cb: (player: Player | NeutralPlayer) => PlayerInput | undefined) {

  }
}
