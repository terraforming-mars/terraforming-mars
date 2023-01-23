import {Message} from '../../common/logs/Message';
import {BasePlayerInput, PlayerInput} from '../PlayerInput';
import {Player} from '../Player';
import {PlayerInputType} from '../../common/input/PlayerInputType';
import {InputResponse, isSelectPlayerResponse} from '../../common/inputs/InputResponse';
import {PlayerInputModel} from '../../common/models/PlayerInputModel';

export class SelectPlayer extends BasePlayerInput {
  constructor(public players: Array<Player>, title: string | Message, buttonLabel: string = 'Save', public cb: (player: Player) => PlayerInput | undefined) {
    super(PlayerInputType.SELECT_PLAYER, title);
    this.buttonLabel = buttonLabel;
  }

  public override toModel(model: PlayerInputModel, _player: Player) {
    model.players = this.players.map((player) => player.color);
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
