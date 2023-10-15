import {Message} from '../../common/logs/Message';
import {BasePlayerInput} from '../PlayerInput';
import {IPlayer} from '../IPlayer';
import {NeutralPlayer} from '../turmoil/Turmoil';
import {InputResponse, isSelectDelegateResponse} from '../../common/inputs/InputResponse';
import {SelectDelegateModel} from '../../common/models/PlayerInputModel';

export class SelectDelegate extends BasePlayerInput<IPlayer | NeutralPlayer> {
  // TODO(kberg): is there any reason to not just accept IDs?
  constructor(
    public players: ReadonlyArray<IPlayer | NeutralPlayer>,
    title: string | Message) {
    super('delegate', title);
  }

  public override toModel(): SelectDelegateModel {
    return {
      type: 'delegate',
      title: this.title,
      buttonLabel: this.buttonLabel,
      players: this.players.map((player) => player === 'NEUTRAL' ? 'NEUTRAL' : player.color),
    };
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
