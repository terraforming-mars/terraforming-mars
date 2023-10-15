import {Message} from '../../common/logs/Message';
import {BasePlayerInput} from '../PlayerInput';
import {IPlayer} from '../IPlayer';
import {InputResponse, isSelectPlayerResponse} from '../../common/inputs/InputResponse';
import {SelectPlayerModel} from '../../common/models/PlayerInputModel';

export class SelectPlayer extends BasePlayerInput<IPlayer> {
  constructor(public players: Array<IPlayer>, title: string | Message, buttonLabel: string = 'Save') {
    super('player', title);
    this.buttonLabel = buttonLabel;
  }

  public override toModel(): SelectPlayerModel {
    return {
      title: this.title,
      buttonLabel: this.buttonLabel,
      type: 'player',
      players: this.players.map((player) => player.color),
    };
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
