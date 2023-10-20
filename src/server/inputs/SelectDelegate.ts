import {Message} from '../../common/logs/Message';
import {BasePlayerInput} from '../PlayerInput';
import {IPlayer} from '../IPlayer';
import {NeutralPlayer} from '../turmoil/Turmoil';
import {InputResponse, isSelectDelegateResponse} from '../../common/inputs/InputResponse';
import {SelectDelegateModel} from '../../common/models/PlayerInputModel';

export class SelectDelegate extends BasePlayerInput<IPlayer | NeutralPlayer> {
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
    for (const player of this.players) {
      if (player === 'NEUTRAL') {
        if (input.player !== 'NEUTRAL') {
          continue;
        }
      } else {
        if (input.player !== player.color) {
          continue;
        }
      }
      return this.cb(player);
    }
    throw new Error('Player not available');
  }
}
