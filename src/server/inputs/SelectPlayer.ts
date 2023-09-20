import {Message} from '../../common/logs/Message';
import {BasePlayerInput, PlayerInput} from '../PlayerInput';
import {IPlayer} from '../IPlayer';
import {InputResponse, isSelectPlayerResponse} from '../../common/inputs/InputResponse';

export class SelectPlayer extends BasePlayerInput {
  constructor(public players: Array<IPlayer>, title: string | Message, buttonLabel: string = 'Save', public cb: (player: IPlayer) => PlayerInput | undefined) {
    super('player', title);
    this.buttonLabel = buttonLabel;
  }

  public process(input: InputResponse) {
    if (!isSelectPlayerResponse(input)) {
      throw new Error('Not a valid SelectPlayerResponse');
    }
    const foundPlayer = this.players.find((player) => player.color === input.player);
    if (foundPlayer === undefined) {
      throw new Error('Player not available');
    }
    return this.cb(foundPlayer);
  }
}
